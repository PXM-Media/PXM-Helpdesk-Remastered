"use server";

import { db } from "@repo/database";
import { macros, tickets } from "@repo/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { executeActions } from "../automations/engine";

// Helper to check admin access
async function checkAdmin() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
    return session;
}

// GET all macros for organization
export async function getMacros() {
    try {
        const session = await checkAdmin();
        // In a real multi-tenant app, filter by orgId
        const results = await db.select().from(macros).orderBy(macros.title);
        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: "Unauthorized" };
    }
}

// CREATE new macro
export async function createMacro(data: any) {
    try {
        await checkAdmin();

        await db.insert(macros).values({
            title: data.title,
            description: data.description,
            active: data.active ?? true,
            actions: JSON.parse(data.actions), // Expecting JSON string from form
        });

        revalidatePath("/dashboard/settings/macros");
        return { success: true };
    } catch (error) {
        console.error("Create macro error:", error);
        return { success: false, error: "Failed to create macro" };
    }
}

// DELETE macro
export async function deleteMacro(id: string) {
    try {
        await checkAdmin();
        await db.delete(macros).where(eq(macros.id, id));
        revalidatePath("/dashboard/settings/macros");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete macro" };
    }
}

// APPLY macro to a ticket
export async function applyMacro(ticketId: number, macroId: string) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const [macro] = await db.select().from(macros).where(eq(macros.id, macroId));

        if (!macro) return { success: false, error: "Macro not found" };

        console.log(`[Macro] User ${session.user.name} applying macro '${macro.title}' to ticket #${ticketId}`);

        // Reuse the engine's executeActions logic
        await executeActions(ticketId, macro.actions as any[], session.user.id);

        revalidatePath(`/dashboard/tickets/${ticketId}`);
        revalidatePath(`/portal/tickets/${ticketId}`); // In case portal updates

        return { success: true };
    } catch (error) {
        console.error("Apply macro error:", error);
        return { success: false, error: "Failed to apply macro" };
    }
}

// GET active macros (for Ticket Detail dropdown)
// Relaxed permission: Agents can call this
export async function getActiveMacros() {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const results = await db.select({
            id: macros.id,
            title: macros.title,
            description: macros.description
        })
            .from(macros)
            .where(eq(macros.active, true))
            .orderBy(macros.title);

        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: "Failed to fetch macros" };
    }
}
