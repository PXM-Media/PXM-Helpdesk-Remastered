
import { db } from "@repo/database";
import { organizations, users } from "@repo/database/schema";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("🌱 Seeding Admin User...");

    // 1. Create Organization
    const [org] = await db.insert(organizations).values({
        name: "PXM Media",
        branding: {
            primaryColor: "#000000",
            portalName: "PXM Help Center",
        },
    }).returning();

    console.log("✅ Organization created:", org.id);

    // 2. Create Admin User
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [admin] = await db.insert(users).values({
        email: "admin@pxm-media.com",
        name: "Admin User",
        role: "ADMIN",
        organizationId: org.id,
        password: hashedPassword,
        active: true,
        verified: true,
    }).returning();

    console.log("✅ Admin user created:");
    console.log("Email: admin@pxm-media.com");
    console.log("Password: password123");

    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
