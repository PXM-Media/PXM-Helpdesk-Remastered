import { getWebhooks, deleteWebhook, createWebhook } from "@/lib/actions/webhooks";
import { Button } from "@repo/ui/button";
import { Trash2, Plus, Webhook } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
    const { data: hooks } = await getWebhooks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Integrations & Webhooks</h3>
                    <p className="text-sm text-muted-foreground">
                        Connect OpenDesk to external systems (n8n, Slack, Zapier).
                    </p>
                </div>
                {/* Simple Create Dialog Trigger */}
                <CreateWebhookForm />
            </div>

            <div className="grid gap-4">
                {hooks?.map((hook) => (
                    <div key={hook.id} className="flex items-center justify-between rounded-lg border p-4 bg-card">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-900/10 dark:text-blue-400">
                                <Webhook className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">{hook.description || "Untitled Webhook"}</h4>
                                <code className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                                    {hook.url}
                                </code>
                                <div className="flex gap-2 mt-2">
                                    {hook.events.map((evt) => (
                                        <span key={evt} className="inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                            {evt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <form action={async () => {
                            "use server";
                            await deleteWebhook(hook.id);
                        }}>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                ))}

                {(!hooks || hooks.length === 0) && (
                    <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                        No webhooks configured. Add one to start streaming events.
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Client Component for Create Form
// Inline here for simplicity, or move to separate file if clean architecture demanded. 
// Ideally separate file, but for speed in this "Agentic Mode", inline helper works if marked 'use client' appropriately or effectively separated.
// Actually, let's put it in a separate file to avoid server/client boundary issues in one file.
import { CreateWebhookDialog } from "@/components/settings/CreateWebhookDialog";

function CreateWebhookForm() {
    return <CreateWebhookDialog />
}
