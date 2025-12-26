import { getAutomations, deleteAutomation } from "@/lib/actions/automations";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/card";
import { Plus, Trash2, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
    const { data: automations } = await getAutomations();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Automations</h3>
                    <p className="text-sm text-muted-foreground">
                        Create rules to automate ticket workflows.
                    </p>
                </div>
                <Link href="/dashboard/settings/automations/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Automation
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {automations?.map((automation) => (
                    <Card key={automation.id} className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-500/10 p-2 rounded-full text-amber-500">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{automation.name}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    When: {automation.eventType} • {automation.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <form action={async () => {
                                "use server";
                                await deleteAutomation(automation.id);
                            }}>
                                <Button variant="ghost" size="icon" type="submit" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                ))}

                {!automations?.length && (
                    <div className="text-center py-10 text-muted-foreground">
                        No automations found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
