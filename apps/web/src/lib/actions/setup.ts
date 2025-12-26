"use server";

import { db } from "@repo/database";
import { organizations, users, userRoleEnum } from "@repo/database/schema";
import { eq, sql } from "drizzle-orm";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

export async function isSystemInitialized() {
    try {
        const adminCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(users)
            .where(eq(users.role, "ADMIN"));

        const adminCount = Number(adminCountResult[0]?.count || 0);
        return adminCount > 0;
    } catch (error) {
        console.error("Failed to check system initialization:", error);
        return true; // Fail safe: assume initialized to prevent accidental setup exposure
    }
}

export async function setupSystem(formData: FormData) {
    // 1. Guard: Check if system is already initialized
    const initialized = await isSystemInitialized();
    if (initialized) {
        return { success: false, error: "System is already initialized." };
    }

    const orgName = formData.get("orgName") as string;
    const adminName = formData.get("adminName") as string;
    const adminEmail = formData.get("adminEmail") as string;
    const password = formData.get("password") as string;

    if (!orgName || !adminName || !adminEmail || !password) {
        return { success: false, error: "All fields are required." };
    }

    try {
        // 2. Create Organization
        const [org] = await db.insert(organizations).values({
            name: orgName,
            // defaults: {} // Removed invalid property
        }).returning();

        // 3. Create Admin User
        const hashedPassword = await hash(password, 10);

        await db.insert(users).values({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            organizationId: org.id,
            active: true
        });

        // 4. Redirect to login (User will log in manually for now to set cookie)
        // ideally we would sign them in here but auth.js server actions are tricky with redirects sometimes
    } catch (error) {
        console.error("Setup failed:", error);
        return { success: false, error: "Setup failed: " + (error as Error).message };
    }

    redirect("/login?setup=success");
}
