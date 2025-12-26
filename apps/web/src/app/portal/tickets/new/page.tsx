import { getTicketFields } from "@/lib/actions/fields";
import { DynamicTicketForm } from "@/components/tickets/DynamicTicketForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
    const { data: fields } = await getTicketFields();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Submit a Request</h1>
                <p className="text-muted-foreground">Please provide as much detail as possible so we can help you.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New Ticket</CardTitle>
                    <CardDescription>
                        Fill out the form below to create a new support ticket.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Reuse the Dynamic Form for consistency */}
                    <DynamicTicketForm fields={fields || []} />
                </CardContent>
            </Card>
        </div>
    );
}
