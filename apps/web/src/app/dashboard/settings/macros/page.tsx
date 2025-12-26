"use server";

import { getMacros, deleteMacro } from "@/lib/actions/macros";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Plus, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MacrosPage() {
    const result = await getMacros();

    if (!result.success) {
        redirect("/dashboard/settings");
    }

    const macros = result.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Macros</h3>
                    <p className="text-sm text-muted-foreground">
                        Create canned responses and one-click actions for agents.
                    </p>
                </div>
                <Link href="/dashboard/settings/macros/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Macro
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {macros.length === 0 ? (
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>No macros yet</CardTitle>
                            <CardDescription>
                                Create your first macro to speed up your workflow.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    macros.map((macro) => (
                        <Card key={macro.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-base">{macro.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {macro.description || "No description"}
                                        </p>
                                    </div>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await deleteMacro(macro.id);
                                }}>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
