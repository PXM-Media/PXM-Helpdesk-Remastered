import { getWidgetSettings, submitWidgetTicket } from "@/lib/actions/widget";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import { notFound } from "next/navigation";

// Direct server action call in form
async function submit(formData: FormData) {
    "use server";
    const orgId = formData.get("orgId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;

    await submitWidgetTicket(orgId, { name, email, subject, description });
}

export default async function WidgetPage({ params }: { params: { orgId: string } }) {
    const settings = await getWidgetSettings(params.orgId);

    if (!settings || !settings.isEnabled) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Widget Unavailable</CardTitle>
                        <CardDescription>This support widget is currently disabled or does not exist.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-4 flex flex-col items-center justify-center font-sans">
            {/* We use bg-transparent/white so it looks okay in iframe */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg border overflow-hidden">
                <div
                    className="p-4 text-white text-center"
                    style={{ backgroundColor: settings.color }}
                >
                    <h1 className="font-bold text-lg">{settings.title}</h1>
                    <p className="text-sm opacity-90">{settings.greeting}</p>
                </div>

                <div className="p-6">
                    <form action={submit} className="space-y-4">
                        <input type="hidden" name="orgId" value={params.orgId} />

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required placeholder="Your name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="name@example.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" required placeholder="How can we help?" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Message</Label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Describe your issue..."
                                rows={4}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-white"
                            style={{ backgroundColor: settings.color }}
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
