import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">General Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your organization profile and preferences.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Organization Profile</CardTitle>
                    <CardDescription>
                        Update your organization&apos;s basic information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input id="orgName" defaultValue="PXM Media" disabled />
                            <p className="text-xs text-muted-foreground">Contact support to change your organization name.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portalName">Portal Name</Label>
                            <Input id="portalName" defaultValue="PXM Help Center" />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
