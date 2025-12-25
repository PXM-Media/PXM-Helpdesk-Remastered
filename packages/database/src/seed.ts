import * as dotenv from "dotenv";
const result = dotenv.config({ path: "../../.env" });
console.log("Dotenv path:", "../../.env");
console.log("Dotenv error:", result.error);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

import { db } from "./index";
import { organizations, users, tickets, groups } from "./schema";

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Create Organization
    console.log("Creating Organization...");
    const [org] = await db.insert(organizations).values({
        name: "Acme Corp",
        domainNames: ["acme.com"],
    }).returning();

    // 2. Create Group (Support Team)
    console.log("Creating Group...");
    const [group] = await db.insert(groups).values({
        name: "Level 1 Support",
        description: "General inquiries",
    }).returning();

    // 3. Create Agents
    console.log("Creating Agents...");
    const [admin] = await db.insert(users).values({
        email: "admin@opendesk.io",
        name: "Admin User",
        role: "ADMIN",
        organizationId: org.id,
        defaultGroupId: group.id,
    }).returning();

    const [agent] = await db.insert(users).values({
        email: "agent@opendesk.io",
        name: "Agent Smith",
        role: "AGENT",
        organizationId: org.id,
        defaultGroupId: group.id,
    }).returning();

    // 4. Create Customers
    console.log("Creating Customers...");
    const [customer1] = await db.insert(users).values({
        email: "alice@example.com",
        name: "Alice Wonderland",
        role: "END_USER",
        organizationId: org.id,
    }).returning();

    const [customer2] = await db.insert(users).values({
        email: "bob@example.com",
        name: "Bob Builder",
        role: "END_USER",
        organizationId: org.id,
    }).returning();

    // 5. Create Tickets
    console.log("Creating Tickets...");
    await db.insert(tickets).values([
        {
            subject: "Login page is throwing 500 error",
            description: "I cannot login to my account. It says 'Internal Server Error'.",
            status: "NEW",
            priority: "URGENT",
            type: "INCIDENT",
            requesterId: customer1.id,
            submitterId: customer1.id,
            organizationId: org.id,
        },
        {
            subject: "How do I reset my password?",
            description: "I forgot my password.",
            status: "OPEN",
            priority: "NORMAL",
            type: "QUESTION",
            requesterId: customer2.id,
            submitterId: customer2.id,
            assigneeId: agent.id,
            organizationId: org.id,
        },
        {
            subject: "Feature Request: Dark Mode",
            description: "Please add dark mode.",
            status: "PENDING",
            priority: "LOW",
            type: "TASK",
            requesterId: customer1.id,
            submitterId: customer1.id,
            organizationId: org.id,
        }
    ]);

    console.log("✅ Seeding complete.");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
