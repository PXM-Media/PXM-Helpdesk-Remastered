import { setupSystem, isSystemInitialized } from "@/lib/actions/setup";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
    // Double check on render to prevent access if initialized
    const initialized = await isSystemInitialized();
    if (initialized) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome onto Board 🚀</CardTitle>
                    <CardDescription className="text-center">
                        Let's set up your helpdesk. Create your organization and primary admin account.
                    </CardDescription>
                </CardHeader>
                <form action={async (formData) => {
                    "use server";
                    await setupSystem(formData);
                }}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input id="orgName" name="orgName" placeholder="Acme Corp" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminName">Admin Name</Label>
                            <Input id="adminName" name="adminName" placeholder="Jane Doe" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Admin Email</Label>
                            <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Initialize System</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
