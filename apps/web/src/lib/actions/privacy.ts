"use server";

import { db } from "@repo/database";
import { users, tickets, comments } from "@repo/database/schema";
import { eq, or } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------
// Export Data (Right to Access)
// ----------------------------------------------------------------------

export async function exportUserData(userId: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                requestedTickets: { with: { comments: true } },
                assignedTickets: true,
            }
        });

        if (!user) return { success: false, error: "User not found" };

        // Return pure JSON data
        return { success: true, data: JSON.stringify(user, null, 2) };
    } catch (error) {
        console.error("Export failed:", error);
        return { success: false, error: "Export failed" };
    }
}

// ----------------------------------------------------------------------
// Anonymize User (Right to be Forgotten)
// ----------------------------------------------------------------------

export async function anonymizeUser(userId: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        // Prevent deleting self
        if (session.user.id === userId) return { success: false, error: "Cannot delete yourself" };

        // Soft delete / Anonymize
        await db.update(users).set({
            name: "Anonymized User",
            email: `deleted-${userId}@anonymized.local`, // Keep unique constraint happy but unusable
            password: null,
            image: null,
            phone: null,
            active: false,
            role: "END_USER" // Strip admin rights if any
        }).where(eq(users.id, userId));

        revalidatePath("/dashboard/settings/users");
        return { success: true };
    } catch (error) {
        console.error("Anonymization failed:", error);
        return { success: false, error: "Anonymization failed" };
    }
}
