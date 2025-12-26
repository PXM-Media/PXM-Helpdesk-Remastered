"use server";

import { db } from "@repo/database";
import { tickets } from "@repo/database/schema";
import { count, eq, sql } from "drizzle-orm";
import { auth } from "../../../auth";

export async function getAnalyticsData() {
    try {
        const session = await auth();
        // MVP: Allow Agents and Admins to see analytics? Or just Admins?
        // Let's restrict to Admins for now as per "Administration & Configuration" phase.
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        // 1. KPI Cards
        // High-level counts
        const [totalTickets] = await db.select({ count: count() }).from(tickets);

        const [openTickets] = await db.select({ count: count() })
            .from(tickets)
            .where(sql`${tickets.status} != 'SOLVED' AND ${tickets.status} != 'CLOSED'`);

        const [solvedTickets] = await db.select({ count: count() })
            .from(tickets)
            .where(eq(tickets.status, "SOLVED"));

        // 2. Charts Data

        // Tickets by Status
        const ticketsByStatus = await db.select({
            name: tickets.status,
            value: count()
        })
            .from(tickets)
            .groupBy(tickets.status);

        // Tickets by Priority
        const ticketsByPriority = await db.select({
            name: tickets.priority,
            value: count()
        })
            .from(tickets)
            .groupBy(tickets.priority);

        // Tickets Created Over Time (Last 7 Days - MVP simplified: All time grouped by day)
        // Note: SQLite/Postgres date truncation syntax differs. Assuming Postgres here.
        const ticketsOverTime = await db.select({
            date: sql<string>`to_char(${tickets.createdAt}, 'YYYY-MM-DD')`,
            count: count()
        })
            .from(tickets)
            .groupBy(sql`to_char(${tickets.createdAt}, 'YYYY-MM-DD')`)
            .orderBy(sql`to_char(${tickets.createdAt}, 'YYYY-MM-DD')`);

        return {
            success: true,
            data: {
                kpis: {
                    total: totalTickets?.count ?? 0,
                    open: openTickets?.count ?? 0,
                    solved: solvedTickets?.count ?? 0,
                },
                charts: {
                    byStatus: ticketsByStatus,
                    byPriority: ticketsByPriority,
                    overTime: ticketsOverTime
                }
            }
        };

    } catch (error) {
        console.error("Analytics error:", error);
        return { success: false, error: "Failed to fetch analytics" };
    }
}
