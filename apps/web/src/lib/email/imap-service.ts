
import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import { db } from "@repo/database";
import { users, tickets, comments, emailSettings } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export async function syncEmailsForOrganization(setting: typeof emailSettings.$inferSelect) {
    if (!setting.enabled) return;

    const config = {
        imap: {
            user: setting.imapUser,
            password: setting.imapPassword,
            host: setting.imapHost,
            port: setting.imapPort,
            tls: true,
            authTimeout: 3000,
        },
    };

    try {
        const connection = await imaps.connect(config);

        await connection.openBox("INBOX");

        const searchCriteria = ["UNSEEN"];
        const fetchOptions = {
            bodies: ["HEADER", "TEXT", ""],
            markSeen: false, // We'll mark seen after successful processing
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        for (const message of messages) {
            try {
                const allParts = message.parts;
                const source = allParts.find((part: any) => part.which === "")?.body; // Full body for parsing

                if (!source) continue;

                const parsed = await simpleParser(source);
                const { subject, from, text, html, messageId } = parsed;

                const senderEmail = from?.value[0]?.address;
                const senderName = from?.value[0]?.name || senderEmail;

                if (!senderEmail || !subject) continue;

                // 1. Reply Detection: Check for [Ticket #1234] pattern
                const ticketMatch = subject.match(/\[Ticket #(\d+)\]/i);

                if (ticketMatch) {
                    // --- EXISTING TICKET (REPLY) ---
                    const ticketId = parseInt(ticketMatch[1]);

                    const existingTicket = await db.query.tickets.findFirst({
                        where: eq(tickets.id, ticketId),
                    });

                    if (existingTicket) {
                        // Find or create user (Author)
                        let author = await db.query.users.findFirst({
                            where: eq(users.email, senderEmail),
                        });

                        if (!author) {
                            const [newUser] = await db.insert(users).values({
                                email: senderEmail,
                                name: senderName || "Email User",
                                role: "END_USER",
                                organizationId: setting.organizationId,
                            }).returning();
                            author = newUser;
                        }

                        // Create Comment
                        await db.insert(comments).values({
                            ticketId: ticketId,
                            authorId: author.id,
                            body: text || html || "(No content)",
                            htmlBody: html || undefined,
                            public: true, // Email replies are usually public
                            channel: "EMAIL",
                        });

                        // Update ticket status to OPEN if it was SOLVED/PENDING? 
                        // For MVP keep simplistic.

                        console.log(`[IMAP] Added reply to ticket #${ticketId} from ${senderEmail}`);
                    }
                } else {
                    // --- NEW TICKET ---
                    // Find or create user (Requester)
                    let requester = await db.query.users.findFirst({
                        where: eq(users.email, senderEmail),
                    });

                    if (!requester) {
                        const [newUser] = await db.insert(users).values({
                            email: senderEmail,
                            name: senderName || "Email User",
                            role: "END_USER",
                            organizationId: setting.organizationId,
                        }).returning();
                        requester = newUser;
                    }

                    const [newTicket] = await db.insert(tickets).values({
                        subject: subject,
                        description: text || html || "(No content)",
                        requesterId: requester.id,
                        submitterId: requester.id,
                        status: "NEW",
                        priority: "NORMAL",
                        type: "QUESTION",
                        organizationId: setting.organizationId,
                    }).returning();

                    console.log(`[IMAP] Created ticket #${newTicket.id} from ${senderEmail}`);
                }

                // Mark as seen only if processed successfully
                await connection.addFlags(message.attributes.uid, "SEEN");

            } catch (err) {
                console.error(`[IMAP] Error processing message ${message.attributes.uid}:`, err);
            }
        }

        connection.end();

        // Update last sync time
        await db.update(emailSettings)
            .set({ lastSyncAt: new Date() })
            .where(eq(emailSettings.id, setting.id));

    } catch (error) {
        console.error(`[IMAP] Sync failed for org ${setting.organizationId}:`, error);
    }
}
