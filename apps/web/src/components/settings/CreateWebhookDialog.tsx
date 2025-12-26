"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { createWebhook } from "@/lib/actions/webhooks";
import { Plus, Webhook } from "lucide-react";
import { useFormStatus } from "react-dom";

export function CreateWebhookDialog() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    <h2 className="text-lg font-bold">Add Webhook</h2>
                </div>

                <form action={async (formData) => {
                    await createWebhook(formData);
                    setIsOpen(false);
                }} className="space-y-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <input name="description" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm" placeholder="e.g. Production n8n instance" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Payload URL</label>
                        <input name="url" type="url" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm" placeholder="https://..." />
                    </div>

                    <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
                        This webhook will receive <strong>POST</strong> requests for all ticket and comment events.
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Create Webhook"}</Button>
}
