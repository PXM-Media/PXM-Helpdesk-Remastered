"use server";

import { db } from "@repo/database";
import { organizations } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getOrganization() {
    try {
        const session = await auth();
        const user = session?.user as any;
        if (!user?.organizationId) return { success: false, error: "No organization found" };

        const org = await db.query.organizations.findFirst({
            where: (organizations, { eq }) => eq(organizations.id, user.organizationId)
        });

        return { success: true, data: org };
    } catch (error) {
        console.error("Failed to fetch organization:", error);
        return { success: false, error: "Failed to fetch organization" };
    }
}

export async function updateBranding(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const user = session.user as any;

        // Strict Admin Check
        if (user.role !== "ADMIN" || !user.organizationId) {
            return { success: false, error: "Unauthorized" };
        }

        const logoUrl = formData.get("logoUrl") as string;
        const primaryColor = formData.get("primaryColor") as string;
        const portalName = formData.get("portalName") as string;

        // Fetch existing logic to merge or overwrite? Drizzle update overwrites usage of column usually, 
        // but since it's JSONB, we should be careful. Here we replace the whole object for simplicity 
        // as the UI will submit all fields.

        await db.update(organizations)
            .set({
                branding: {
                    logoUrl,
                    primaryColor,
                    portalName
                }
            })
            .where(eq(organizations.id, user.organizationId));

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/settings/appearance");
        return { success: true };
    } catch (error) {
        console.error("Failed to update branding:", error);
        return { success: false, error: "Failed to update branding" };
    }
}
