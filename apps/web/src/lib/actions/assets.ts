"use server";

import { db } from "@repo/database";
import { assets } from "@repo/database/schema"; // Ensure exports are aligned
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getAssets() {
    try {
        const session = await auth();
        // Allow Agents and Admins
        if (!["ADMIN", "AGENT"].includes(session?.user?.role || "")) {
            return { success: false, error: "Unauthorized" };
        }

        const items = await db.query.assets.findMany({
            orderBy: (assets, { desc }) => [desc(assets.createdAt)],
            with: {
                assignedTo: true
            }
        });
        return { success: true, data: items };
    } catch (error) {
        console.error("Failed to fetch assets:", error);
        return { success: false, error: "Failed to fetch assets" };
    }
}

export async function createAsset(formData: FormData) {
    try {
        const session = await auth();
        if (!["ADMIN", "AGENT"].includes(session?.user?.role || "")) {
            return { success: false, error: "Unauthorized" };
        }

        const name = formData.get("name") as string;
        const tag = formData.get("tag") as string;
        const type = formData.get("type") as "HARDWARE" | "SOFTWARE" | "LICENSE" | "PERIPHERAL" | "OTHER";
        const status = formData.get("status") as "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED" | "LOST";
        const notes = formData.get("notes") as string;
        // assignedToId logic can be added later or via update

        await db.insert(assets).values({
            name,
            tag: tag || null, // Optional
            type,
            status,
            notes,
        });

        revalidatePath("/dashboard/assets");
        return { success: true };
    } catch (error) {
        console.error("Failed to create asset:", error);
        return { success: false, error: "Failed to create asset" };
    }
}

export async function deleteAsset(id: string) {
    try {
        const session = await auth();
        if (!["ADMIN", "AGENT"].includes(session?.user?.role || "")) {
            return { success: false, error: "Unauthorized" };
        }

        await db.delete(assets).where(eq(assets.id, id));
        revalidatePath("/dashboard/assets");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete asset:", error);
        return { success: false, error: "Failed to delete asset" };
    }
}
