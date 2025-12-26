"use client";

import { getEmailSettings, updateEmailSettings } from "@/lib/actions/email";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useToast } from "@repo/ui/use-toast";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Ticket } from "lucide-react";

export default function EmailSettingsPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        imapHost: "",
        imapPort: 993,
        imapUser: "",
        imapPassword: "",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        enabled: false,
    });

    const orgId = (session?.user as any)?.organizationId;

    useEffect(() => {
        if (status === "loading") return;
        if (!orgId) {
            setLoading(false);
            return;
        }
        getEmailSettings(orgId).then((data) => {
            if (data) {
                setSettings({
                    imapHost: data.imapHost,
                    imapPort: data.imapPort,
                    imapUser: data.imapUser,
                    imapPassword: data.imapPassword,
                    smtpHost: data.smtpHost,
                    smtpPort: data.smtpPort,
                    smtpUser: data.smtpUser,
                    smtpPassword: data.smtpPassword,
                    enabled: data.enabled,
                });
            }
            setLoading(false);
        });
    }, [orgId, status]);

    async function handleSubmit(formData: FormData) {
        if (!orgId) return;

        const data: any = {};
        formData.forEach((value, key) => {
            if (key.includes("Port")) {
                data[key] = parseInt(value as string);
            } else if (key === "enabled") {
                // Checkbox specific handling usually handled by state or getting 'on'
            } else {
                data[key] = value;
            }
        });

        // Manual checkbox handling from form data logic
        data.enabled = formData.get("enabled") === "on";

        const result = await updateEmailSettings(orgId, data);

        if (result.success) {
            toast({ title: "Settings Saved", description: "Email settings have been updated." });
        } else {
            toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Email Channel</h3>
                <p className="text-sm text-muted-foreground">
                    Connect an external email account (via IMAP/SMTP) to automatically create tickets from incoming emails.
                </p>
            </div>

            <form action={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inbound Settings (IMAP)</CardTitle>
                            <CardDescription>Server details for receiving emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="imapHost">IMAP Host</Label>
                                    <Input id="imapHost" name="imapHost" defaultValue={settings.imapHost} required placeholder="imap.gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="imapPort">IMAP Port</Label>
                                    <Input id="imapPort" name="imapPort" type="number" defaultValue={settings.imapPort} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="imapUser">Username / Email</Label>
                                    <Input id="imapUser" name="imapUser" defaultValue={settings.imapUser} required placeholder="support@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="imapPassword">Password</Label>
                                    <Input id="imapPassword" name="imapPassword" type="password" defaultValue={settings.imapPassword} required />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Outbound Settings (SMTP)</CardTitle>
                            <CardDescription>Server details for sending replies.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">SMTP Host</Label>
                                    <Input id="smtpHost" name="smtpHost" defaultValue={settings.smtpHost} required placeholder="smtp.gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input id="smtpPort" name="smtpPort" type="number" defaultValue={settings.smtpPort} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUser">Username / Email</Label>
                                    <Input id="smtpUser" name="smtpUser" defaultValue={settings.smtpUser} required placeholder="support@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPassword">Password</Label>
                                    <Input id="smtpPassword" name="smtpPassword" type="password" defaultValue={settings.smtpPassword} required />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activation</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="enabled"
                                name="enabled"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                defaultChecked={settings.enabled}
                            />
                            <Label htmlFor="enabled">Enable Email Parsing</Label>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <p className="text-xs text-muted-foreground">The system will sync emails every minute.</p>
                            <Button type="submit">Save Connections</Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    );
}
