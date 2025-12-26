import { db } from "@repo/database";
import { automations, tickets, ticketStatusEnum, ticketPriorityEnum, users } from "@repo/database/schema";
import { eq, and } from "drizzle-orm";

type AutomationEvent = "TICKET_CREATED" | "TICKET_UPDATED";

interface Condition {
    field: string;
    operator: string;
    value: string;
}

interface Action {
    action: string;
    value: string;
}

// Function to process automation triggers for a given event
export async function processTriggers(ticketId: number, eventType: AutomationEvent, authorId?: string) {
    try {
        console.log(`[Automation] Processing triggers for ticket #${ticketId} on event ${eventType}`);

        // 1. Fetch Ticket
        const ticket = await db.query.tickets.findFirst({
            where: eq(tickets.id, ticketId),
            with: {
                // tags: true, // If we had tags relation implemented
            }
        });

        if (!ticket) {
            console.error("[Automation] Ticket not found");
            return;
        }

        // 2. Fetch Automations
        const activeAutomations = await db.select().from(automations)
            .where(and(
                eq(automations.active, true),
                eq(automations.eventType, eventType)
            ))
            .orderBy(automations.sortOrder);

        console.log(`[Automation] Found ${activeAutomations.length} active automations`);

        // 3. Loop and Check Conditions
        for (const rule of activeAutomations) {
            const conditions = rule.conditions as Condition[];
            const actions = rule.actions as Action[];

            if (evaluateConditions(ticket, conditions)) {
                console.log(`[Automation] Rule matched: ${rule.name}`);
                // Execute the actions defined for this rule
                await executeActions(ticketId, actions, authorId);
            }
        }

    } catch (error) {
        console.error("[Automation] Error processing triggers:", error);
    }
}

function evaluateConditions(ticket: any, conditions: Condition[]): boolean {
    // Logic: ALL conditions must be true (AND)
    for (const condition of conditions) {
        let ticketValue = ticket[condition.field];

        // Basic casting/handling
        if (ticketValue === undefined) return false;
        ticketValue = String(ticketValue);

        switch (condition.operator) {
            case "eq": // Equals
                if (ticketValue !== condition.value) return false;
                break;
            case "neq": // Not Equals
                if (ticketValue === condition.value) return false;
                break;
            // Add more operators (contains, gt, lt) later
            default:
                return false;
        }
    }
    return true;
}

// Function to execute a list of actions on a ticket
export async function executeActions(ticketId: number, actions: Action[], authorId?: string) {
    // Group updates to minimize DB calls
    const updates: any = {};
    let shouldUpdate = false;
    let commentBody: string | null = null;
    let isPublicComment = true; // Default to public

    for (const action of actions) {
        switch (action.action) {
            case "set_status":
                updates.status = action.value as any;
                shouldUpdate = true;
                break;
            case "set_priority":
                updates.priority = action.value as any;
                shouldUpdate = true;
                break;
            case "assign_user":
                updates.assigneeId = action.value; // Expects UUID
                shouldUpdate = true;
                break;
            case "comment":
                // If multiple comment actions, we might append or just take the last one.
                // For MVP, taking the last one.
                commentBody = action.value;
                break;
            case "comment_internal":
                commentBody = action.value;
                isPublicComment = false;
                break;
            // Add more actions (add_tag, send_email) later
        }
    }

    if (shouldUpdate) {
        console.log(`[Automation] Applying updates to ticket #${ticketId}:`, updates);
        await db.update(tickets)
            .set(updates)
            .where(eq(tickets.id, ticketId));
    }

    if (commentBody) {
        try {
            // For MVP, we simply log this requirement.
            // In a real system we would insert into comments table directly.
            console.log(`[Automation] Should add comment: "${commentBody}" (Public: ${isPublicComment})`);
            if (authorId) {
                // If authorId is provided (Macros), we can insert directly if needed,
                // but to avoid circular imports of 'addComment' action, we will skip implementation
                // of actual comment insertion in this engine file for now.
            }
        } catch (e) {
            console.error("Failed to add comment from automation", e);
        }
    }
}
