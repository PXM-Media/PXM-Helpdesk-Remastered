"use server";

import { db } from "@repo/database";
import { emailSettings } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEmailSettings(orgId: string) {
    try {
        const settings = await db.query.emailSettings.findFirst({
            where: eq(emailSettings.organizationId, orgId),
        });
        return settings || null;
    } catch (error) {
        console.error("Failed to fetch email settings:", error);
        return null;
    }
}

export async function updateEmailSettings(orgId: string, data: any) {
    try {
        const existing = await db.query.emailSettings.findFirst({
            where: eq(emailSettings.organizationId, orgId),
        });

        if (existing) {
            await db.update(emailSettings)
                .set(data)
                .where(eq(emailSettings.id, existing.id));
        } else {
            await db.insert(emailSettings).values({
                organizationId: orgId,
                ...data,
            });
        }

        revalidatePath(`/dashboard/settings/channels/email`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update email settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}
