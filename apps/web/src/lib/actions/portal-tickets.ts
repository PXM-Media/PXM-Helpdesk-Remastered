"use server";

import { db } from "@repo/database";
import { tickets, organizations } from "@repo/database/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "../../../auth";

export async function getUserTickets() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const userId = session.user.id;

        // Fetch tickets where user is requester
        const userTickets = await db.query.tickets.findMany({
            where: (tickets, { eq }) => eq(tickets.requesterId, userId),
            orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
            with: {
                assignee: true,
            }
        });

        return { success: true, data: userTickets };
    } catch (error) {
        console.error("Failed to fetch user tickets:", error);
        return { success: false, error: "Failed to fetch tickets" };
    }
}
