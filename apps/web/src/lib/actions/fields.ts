"use server";

import { db } from "@repo/database";
import { ticketFields } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getTicketFields() {
    try {
        const fields = await db.query.ticketFields.findMany({
            orderBy: (fields, { asc }) => [asc(fields.position)],
        });
        return { success: true, data: fields };
    } catch (error) {
        console.error("Failed to fetch fields:", error);
        return { success: false, error: "Failed to fetch fields" };
    }
}

export async function createTicketField(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        const title = formData.get("title") as string;
        const type = formData.get("type") as "TEXT" | "TEXTAREA" | "DROPDOWN" | "CHECKBOX" | "DATE" | "INTEGER" | "DECIMAL";
        const required = formData.get("required") === "on";

        await db.insert(ticketFields).values({
            title,
            type,
            requiredInPortal: required,
            active: true,
            position: 0, // Default to top for now
        });

        revalidatePath("/dashboard/settings/fields");
        return { success: true };
    } catch (error) {
        console.error("Failed to create field:", error);
        return { success: false, error: "Failed to create field" };
    }
}

export async function toggleFieldStatus(id: string, active: boolean) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        await db.update(ticketFields)
            .set({ active })
            .where(eq(ticketFields.id, id));

        revalidatePath("/dashboard/settings/fields");
        return { success: true };
    } catch (error) {
        console.error("Failed to update field status:", error);
        return { success: false, error: "Failed to update field status" };
    }
}
