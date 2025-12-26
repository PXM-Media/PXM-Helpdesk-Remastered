"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { useState } from "react";
import { createUser } from "@/lib/actions/users";
import { useToast } from "@repo/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function InviteUserPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const role = formData.get("role") as "ADMIN" | "AGENT" | "END_USER";

        if (!session?.user?.id) return; // Should not happen due to middleware
        const orgId = (session.user as any).organizationId;

        const result = await createUser(orgId, { name, email, role });

        if (result.success) {
            toast({ title: "User Invited", description: `${name} has been added to the organization.` });
            router.push("/dashboard/settings/users");
        } else {
            toast({ title: "Error", description: result.error || "Failed to create user", variant: "destructive" });
        }
        setLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h3 className="text-lg font-medium">Invite User</h3>
                <p className="text-sm text-muted-foreground">
                    Add a new member to your organization.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Enter the information for the new user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="invite-form" action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" defaultValue="AGENT">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AGENT">Agent (Can manage tickets)</SelectItem>
                                    <SelectItem value="ADMIN">Admin (Full access)</SelectItem>
                                    <SelectItem value="END_USER">End User (Customer)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Password will be set via invite link in a real app, 
                             but here we might set a temp one or just rely on 'Verified' flag logic in action 
                             In our seed, we set passwords manually. 
                             The createUser action presumably handles this (checks logic later). 
                             For now assuming createUser sets a default or handles it.
                         */}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" form="invite-form" disabled={loading}>
                        {loading ? "Inviting..." : "Send Invite"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
