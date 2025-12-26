import nodemailer from "nodemailer";
import { db } from "@repo/database";
import { emailSettings } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export async function sendEmail(
    organizationId: string,
    to: string,
    subject: string,
    html: string
) {
    try {
        // 1. Fetch SMTP settings for the org
        const settings = await db.query.emailSettings.findFirst({
            where: eq(emailSettings.organizationId, organizationId),
        });

        if (!settings || !settings.enabled) {
            console.warn(`[Email] No enabled email settings found for org ${organizationId}. Cannot send email to ${to}.`);
            // In a real app, maybe fallback to a system smtp or fail?
            // For MVP, we fail silently or log.
            return { success: false, error: "SMTP not configured" };
        }

        // 2. Create Transporter
        const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort,
            secure: settings.smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPassword,
            },
        });

        // 3. Send
        const info = await transporter.sendMail({
            from: `"${settings.imapUser}" <${settings.smtpUser}>`, // Use configured user
            to,
            subject,
            html,
        });

        console.log(`[Email] Sent to ${to}. MessageId: ${info.messageId}`);
        return { success: true };

    } catch (error) {
        console.error("[Email] Send failed:", error);
        return { success: false, error: "Failed to send email" };
    }
}
