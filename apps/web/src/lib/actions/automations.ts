"use server";

import { db } from "@repo/database";
import { automations } from "@repo/database/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getAutomations() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const data = await db.select().from(automations)
            .orderBy(desc(automations.createdAt));

        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to fetch automations" };
    }
}

export async function createAutomation(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const name = formData.get("name") as string;
        const eventType = formData.get("eventType") as "TICKET_CREATED" | "TICKET_UPDATED";
        const description = formData.get("description") as string;

        // MVP: Hardcode complex JSON for now or parse from specialized form fields
        // In a real app we'd need a robust form builder. 
        // For MVP, we will accept a raw JSON string or specialized input.
        const conditionsStr = formData.get("conditions") as string;
        const actionsStr = formData.get("actions") as string;

        let conditions, actions;
        try {
            conditions = JSON.parse(conditionsStr);
            actions = JSON.parse(actionsStr);
        } catch (e) {
            return { success: false, error: "Invalid JSON for conditions or actions" };
        }

        await db.insert(automations).values({
            name,
            eventType,
            description,
            conditions,
            actions,
            active: true
        });

        revalidatePath("/dashboard/settings/automations");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create automation" };
    }
}

export async function deleteAutomation(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        await db.delete(automations).where(eq(automations.id, id));
        revalidatePath("/dashboard/settings/automations");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete" };
    }
}
