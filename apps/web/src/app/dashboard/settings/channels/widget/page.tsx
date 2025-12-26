"use client";

import { getWidgetSettings, updateWidgetSettings } from "@/lib/actions/widget";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useToast } from "@repo/ui/use-toast";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function WidgetSettingsPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        title: "Help Desk",
        greeting: "How can we help you today?",
        color: "#000000",
    });

    const orgId = (session?.user as any)?.organizationId;

    useEffect(() => {
        if (status === "loading") return;
        if (!orgId) {
            setLoading(false);
            return;
        }
        getWidgetSettings(orgId).then((data) => {
            if (data) {
                setSettings({
                    title: data.title,
                    greeting: data.greeting,
                    color: data.color,
                });
            }
            setLoading(false);
        });
    }, [orgId, status]);

    async function handleSubmit(formData: FormData) {
        if (!orgId) return;

        const title = formData.get("title") as string;
        const greeting = formData.get("greeting") as string;
        const color = formData.get("color") as string;

        const result = await updateWidgetSettings(orgId, {
            title,
            greeting,
            color,
        });

        if (result.success) {
            toast({ title: "Settings Saved", description: "Widget settings have been updated." });
            setSettings({ title, greeting, color });
        } else {
            toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget/${orgId}" width="400" height="600" style="border:none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: fixed; bottom: 20px; right: 20px; z-index: 9999;"></iframe>`;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Web Widget</h3>
                <p className="text-sm text-muted-foreground">
                    Configure the widget that appears on your website.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance & Text</CardTitle>
                        <CardDescription>Customize how the widget looks to your users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="settings-form" action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Widget Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={settings.title}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="greeting">Greeting Message</Label>
                                <Input
                                    id="greeting"
                                    name="greeting"
                                    defaultValue={settings.greeting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Brand Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        name="color"
                                        type="color"
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        defaultValue={settings.color}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        value={settings.color}
                                        readOnly
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" form="settings-form">Save Changes</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Embed Code</CardTitle>
                        <CardDescription>Copy and paste this code into your website's HTML.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-zinc-950 p-4 rounded-md overflow-x-auto relative group">
                            <code className="text-sm font-mono text-zinc-50 block whitespace-pre-wrap">
                                {embedCode}
                            </code>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                    navigator.clipboard.writeText(embedCode);
                                    toast({ title: "Copied", description: "Embed code copied to clipboard" });
                                }}
                            >
                                Copy
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center bg-gray-100 p-8 rounded-b-lg">
                    {/* Live Preview Iframe */}
                    <iframe
                        src={`/widget/${orgId}`}
                        width="350"
                        height="500"
                        className="bg-white shadow-xl rounded-lg border"
                        title="Widget Preview"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
