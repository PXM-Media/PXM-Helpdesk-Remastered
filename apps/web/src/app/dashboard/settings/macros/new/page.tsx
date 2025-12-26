"use client";

import { createMacro } from "@/lib/actions/macros";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useToast } from "@repo/ui/use-toast";
import { useRouter } from "next/navigation";
import { MacroBuilder } from "@/components/macros/MacroBuilder";
import { useState } from "react";

export default function NewMacroPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [actions, setActions] = useState<any[]>([]);

    async function handleSubmit(formData: FormData) {
        const title = formData.get("title");
        const description = formData.get("description");

        if (!title || actions.length === 0) {
            toast({ title: "Error", description: "Title and at least one Action are required", variant: "destructive" });
            return;
        }

        const result = await createMacro({
            title,
            description,
            actions: JSON.stringify(actions),
        });

        if (result.success) {
            toast({ title: "Success", description: "Macro created" });
            router.push("/dashboard/settings/macros");
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/settings/macros">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h3 className="text-lg font-medium">New Macro</h3>
                    <p className="text-sm text-muted-foreground">
                        Define automated actions for agents.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Macro Details</CardTitle>
                    <CardDescription>Basic information about this macro.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Password Reset Template"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Briefly describe what this macro does"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Actions</Label>
                            <MacroBuilder
                                onChange={setActions}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Create Macro
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
