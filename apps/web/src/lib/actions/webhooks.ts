"use server";

import { db } from "@repo/database";
import { webhooks } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function getWebhooks() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const hooks = await db.query.webhooks.findMany({
            orderBy: (webhooks, { desc }) => [desc(webhooks.createdAt)],
        });
        return { success: true, data: hooks };
    } catch (error) {
        console.error("Failed to fetch webhooks:", error);
        return { success: false, error: "Failed to fetch webhooks" };
    }
}

export async function createWebhook(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        const url = formData.get("url") as string;
        const description = formData.get("description") as string;
        // Basic events parsing - simpler for MVP to just toggle on specific set
        // For now, let's just subscribe to ALL supported events if created via simple UI
        const events = ["ticket.created", "ticket.updated", "comment.created"];

        await db.insert(webhooks).values({
            url,
            description,
            events,
            active: true,
        });

        revalidatePath("/dashboard/settings/integrations");
        return { success: true };
    } catch (error) {
        console.error("Failed to create webhook:", error);
        return { success: false, error: "Failed to create webhook" };
    }
}

export async function deleteWebhook(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        await db.delete(webhooks).where(eq(webhooks.id, id));

        revalidatePath("/dashboard/settings/integrations");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete webhook:", error);
        return { success: false, error: "Failed to delete webhook" };
    }
}

// ----------------------------------------------------------------------
// Trigger Logic
// ----------------------------------------------------------------------

export async function triggerWebhooks(event: "ticket.created" | "ticket.updated" | "comment.created", payload: any) {
    // Fire and forget - don't await this in the main blocking path if possible
    // But Vercel functions might kill background unawaited promises.
    // Ideally use Inngest or similar. For generic MVP, we blindly fetch.

    // We run this conceptually in "background" so we wrap in a try/catch that doesn't bubble up 
    // to the UI action, but we DO await it to ensure execution time in serverless.

    try {
        const hooks = await db.query.webhooks.findMany({
            where: (webhooks, { eq }) => eq(webhooks.active, true)
        });

        const targets = hooks.filter(h => h.events.includes(event));

        if (targets.length === 0) return;

        console.log(`[Webhooks] Triggering '${event}' to ${targets.length} endpoints`);

        await Promise.all(targets.map(async (hook) => {
            try {
                const res = await fetch(hook.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Helpdesk-Event": event,
                        // "X-Helpdesk-Signature": ... (TODO)
                    },
                    body: JSON.stringify({
                        event,
                        timestamp: new Date().toISOString(),
                        payload
                    }),
                    signal: AbortSignal.timeout(5000), // 5s timeout
                });
                console.log(`[Webhooks] ${hook.url} -> ${res.status}`);
            } catch (err) {
                console.error(`[Webhooks] Failed to send to ${hook.url}:`, err);
            }
        }));

    } catch (error) {
        console.error("[Webhooks] Trigger manager failed:", error);
    }
}
