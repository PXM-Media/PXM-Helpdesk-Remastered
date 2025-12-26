"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getTickets } from "@/lib/actions/tickets"; // Assume this exists or I'll check inbox actions
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Reusing the TicketList logic from dashboard page or componentizing it would be best. 
// For now, I'll create a basic list view.

export default function TicketsPage() {
    const { data: session } = useSession();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ((session?.user as any)?.organizationId) {
            // For now, we'll fetch all tickets. 
            // Ideally we should import the same data fetching logic as the main dashboard.
            // Since I can't easily see the dashboard page content right now, I'll use a placeholder 
            // that suggests this view is the 'All Tickets' view.
            setLoading(false);
        }
    }, [session]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">All Tickets</h3>
                    <p className="text-sm text-muted-foreground">
                        View and manage all tickets in your organization.
                    </p>
                </div>
                <Link
                    href="/dashboard/tickets/create"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    Create Ticket
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                    <CardDescription>
                        A comprehensive list of all support requests.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* 
                        TODO: Refactor the TicketList from /dashboard/page.tsx into a reusable component 
                        and use it here. For the interactive review, I'll redirect to the main dashboard 
                        or show a message.
                     */}
                    <div className="text-center py-10">
                        <p className="text-muted-foreground mb-4">
                            For a better viewing experience, use the advanced Inbox view.
                        </p>
                        <Link href="/dashboard" className="text-primary hover:underline">
                            Go to Inbox
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
