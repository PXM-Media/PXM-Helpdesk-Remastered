"use server";

import { db } from "@repo/database";
import { type InferSelectModel, eq } from "drizzle-orm";
import { comments, tickets as ticketsTable, tickets, ticketFieldValues } from "@repo/database/schema";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { triggerWebhooks } from "./webhooks";
import { processTriggers } from "../automations/engine";

export type Ticket = InferSelectModel<typeof ticketsTable>;

export async function getTickets() {
    try {
        const tickets = await db.query.tickets.findMany({
            orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
            with: {
                requester: true,
                assignee: true,
            }
        });
        return { success: true, data: tickets };
    } catch (error) {
        console.error("Failed to fetch tickets:", error);
        return { success: false, error: "Failed to fetch tickets" };
    }
}

export async function getTicket(id: number) {
    try {
        const ticket = await db.query.tickets.findFirst({
            where: (tickets, { eq }) => eq(tickets.id, id),
            with: {
                requester: true,
                assignee: true,
                customValues: {
                    with: {
                        field: true
                    }
                },
                comments: {
                    with: {
                        author: true
                    },
                    orderBy: (comments, { asc }) => [asc(comments.createdAt)]
                }
            }
        });

        if (!ticket) return { success: false, error: "Ticket not found" };
        return { success: true, data: ticket };
    } catch (error) {
        console.error("Failed to fetch ticket:", error);
        return { success: false, error: "Failed to fetch ticket" };
    }
}

export async function addComment(ticketId: number, body: string, isPublic: boolean = true) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        await db.insert(comments).values({
            ticketId,
            authorId: session.user.id,
            body,
            public: isPublic,
            channel: "WEB"
        });

        await db.update(ticketsTable)
            .set({ status: "OPEN" })
            .where(eq(ticketsTable.id, ticketId) && eq(ticketsTable.status, "NEW"));

        revalidatePath(`/dashboard/tickets/${ticketId}`);
        revalidatePath(`/dashboard`);

        // Trigger Webhook
        await triggerWebhooks("comment.created", {
            ticketId,
            body,
            authorId: session.user.id,
            public: isPublic
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to add comment:", error);
        return { success: false, error: "Failed to add comment" };
    }
}

export async function updateTicketStatus(ticketId: number, status: "NEW" | "OPEN" | "PENDING" | "HOLD" | "SOLVED" | "CLOSED") {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        await db.update(ticketsTable)
            .set({ status })
            .where(eq(ticketsTable.id, ticketId));

        revalidatePath(`/dashboard/tickets/${ticketId}`);
        revalidatePath(`/dashboard`);

        // Trigger Webhook
        await triggerWebhooks("ticket.updated", { ticketId, status, updaterId: session.user.id });

        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export type CreateTicketState = {
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    ticketId?: number;
} | undefined;

export async function createTicket(prevState: CreateTicketState, formData: FormData): Promise<CreateTicketState> {
    let newTicketId: number | undefined;
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const subject = formData.get("subject") as string;
        const description = formData.get("description") as string;
        const priority = formData.get("priority") as "URGENT" | "HIGH" | "NORMAL" | "LOW" || "NORMAL";

        // Find user to get Org ID
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId)
        });

        if (!user || !user.organizationId) {
            // throw new Error("User organization invalid");
        }

        const [ticket] = await db.insert(ticketsTable).values({
            subject,
            description,
            priority,
            status: "NEW",
            type: "QUESTION",
            requesterId: userId,
            submitterId: userId,
            organizationId: user?.organizationId,
        }).returning();

        newTicketId = ticket.id;

        // Process Custom Fields
        // Iterate over formData keys, look for "custom_" prefix
        const customFieldEntries: { ticketId: number; fieldId: string; value: string }[] = [];

        for (const [key, value] of Array.from(formData.entries())) {
            if (key.startsWith("custom_") && typeof value === "string" && value.trim() !== "") {
                const fieldId = key.replace("custom_", "");
                // Basic validation: check if UUID? Skipping for speed, DB will enforce valid FK.
                customFieldEntries.push({
                    ticketId: ticket.id,
                    fieldId,
                    value: value
                });
            }
        }

        if (customFieldEntries.length > 0) {
            await db.insert(ticketFieldValues).values(customFieldEntries);
        }

        // Trigger Webhook
        await triggerWebhooks("ticket.created", ticket);

        // Process Automations
        // We use setImmediate or just await (Next.js server actions time out eventually, but await is safer for now)
        // Ideally offload to queue. For MVP, await.
        await processTriggers(newTicketId, "TICKET_CREATED");

        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return { success: false, error: "Failed to create ticket" };
    }

    if (newTicketId) {
        redirect(`/dashboard/tickets/${newTicketId}`);
    }
}
