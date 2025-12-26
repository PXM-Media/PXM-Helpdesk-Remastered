import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import { createAutomation } from "@/lib/actions/automations";
import { redirect } from "next/navigation";

export default function NewAutomationPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Automation</h3>
                <p className="text-sm text-muted-foreground">
                    Define a trigger and the actions to perform.
                </p>
            </div>

            <form action={async (formData) => {
                "use server";
                await createAutomation(formData);
                redirect("/dashboard/settings/automations");
            }} className="space-y-6">

                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" placeholder="e.g. Assign Logins to IT" required />
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" placeholder="Should assign all tickets about login issues to the IT team." />
                </div>

                <div className="space-y-2">
                    <Label>Event</Label>
                    <select name="eventType" className="w-full p-2 border rounded-md bg-background">
                        <option value="TICKET_CREATED">Ticket Created</option>
                        <option value="TICKET_UPDATED">Ticket Updated</option>
                    </select>
                </div>

                {/* MVP: Raw JSON Editor because building a recursive conditional UI is huge work */}
                <div className="space-y-2">
                    <Label>Conditions (JSON)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                        Format: <code>[{`{ "field": "subject", "operator": "eq", "value": "Help" }`}]</code>
                    </p>
                    <Textarea
                        name="conditions"
                        className="font-mono text-xs"
                        rows={5}
                        defaultValue='[ { "field": "priority", "operator": "eq", "value": "HIGH" } ]'
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Actions (JSON)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                        Format: <code>[{`{ "action": "set_priority", "value": "URGENT" }`}]</code>
                    </p>
                    <Textarea
                        name="actions"
                        className="font-mono text-xs"
                        rows={5}
                        defaultValue='[ { "action": "set_priority", "value": "URGENT" } ]'
                        required
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit">Create Automation</Button>
                </div>
            </form>
        </div>
    );
}
