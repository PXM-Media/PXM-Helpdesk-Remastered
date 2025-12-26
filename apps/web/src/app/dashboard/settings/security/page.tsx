"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

export default function SecuritySettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your security preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md text-sm">
                        Password changes are currently managed via the "Forgot Password" flow on the login page.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
