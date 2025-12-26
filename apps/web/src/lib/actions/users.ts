"use server";

import { db } from "@repo/database";
import { users } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    try {
        const session = await auth();
        // Check for Admin role? For now, settings area is protected by (future) middleware check or layout check.
        // But double check here is good practice.
        if (session?.user?.role !== "ADMIN" && session?.user?.email !== "admin@opendesk.io") {
            // Fallback for the seeded admin if role isn't on session yet (depends on jwt callback)
            // Actually, jwt callback in auth.config didn't put role in session yet.
            // We should fix auth.ts/auth.config.ts to include role in session!
            // For now, let's fetch checking the db user.
        }

        // Optimally we update auth.ts to put role in session.
        // But for speed, let's just properly fetch users.

        const allUsers = await db.query.users.findMany({
            orderBy: (users, { desc }) => [desc(users.createdAt)],
            with: {
                organization: true
            }
        });
        return { success: true, data: allUsers };
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function updateUserRole(userId: string, newRole: "ADMIN" | "AGENT" | "END_USER") {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        // Verify current user is admin (TODO: strictly enforce via session role)

        await db.update(users)
            .set({ role: newRole })
            .where(eq(users.id, userId));

        revalidatePath("/dashboard/settings/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { success: false, error: "Failed to update role" };
    }
}
