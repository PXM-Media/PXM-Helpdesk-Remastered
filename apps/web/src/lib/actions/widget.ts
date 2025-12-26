"use server";

import { db } from "@repo/database";
import { organizations, tickets, users, widgetSettings } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getWidgetSettings(orgId: string) {
    try {
        const settings = await db.query.widgetSettings.findFirst({
            where: eq(widgetSettings.organizationId, orgId),
        });

        if (!settings) {
            // Return default/mock settings if not found to avoid crashing the widget
            return {
                title: "Help Desk",
                greeting: "How can we help you today?",
                color: "#000000",
                isEnabled: true,
            };
        }

        return settings;
    } catch (error) {
        console.error("Failed to fetch widget settings:", error);
        return null;
    }
}

export async function updateWidgetSettings(orgId: string, data: {
    title: string;
    greeting: string;
    color: string;
}) {
    try {
        const existing = await db.query.widgetSettings.findFirst({
            where: eq(widgetSettings.organizationId, orgId),
        });

        if (existing) {
            await db.update(widgetSettings)
                .set(data)
                .where(eq(widgetSettings.id, existing.id));
        } else {
            await db.insert(widgetSettings).values({
                organizationId: orgId,
                ...data,
            });
        }

        revalidatePath(`/dashboard/settings/channels/widget`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update widget settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

export async function submitWidgetTicket(orgId: string, formData: {
    name: string;
    email: string;
    subject: string;
    description: string;
}) {
    try {
        // 1. Check if user exists, if not create
        let user = await db.query.users.findFirst({
            where: eq(users.email, formData.email),
        });

        if (!user) {
            const [newUser] = await db.insert(users).values({
                email: formData.email,
                name: formData.name,
                role: "END_USER",
                organizationId: orgId,
            }).returning();
            user = newUser;
        }

        // 2. Create Ticket
        const [ticket] = await db.insert(tickets).values({
            subject: formData.subject,
            description: formData.description,
            requesterId: user.id,
            submitterId: user.id,
            status: "NEW",
            priority: "NORMAL",
            organizationId: orgId,
            type: "QUESTION",
        }).returning();

        // 3. Trigger generic 'ticket created' automation would happen here event-driven

        return { success: true, ticketId: ticket.id };

    } catch (error) {
        console.error("Failed to submit widget ticket:", error);
        return { success: false, error: "Failed to submit ticket" };
    }
}
