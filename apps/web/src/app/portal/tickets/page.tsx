import { getUserTickets } from "@/lib/actions/portal-tickets";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PortalTicketsPage() {
    const { data: tickets } = await getUserTickets();

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            OPEN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            HOLD: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
            SOLVED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
            CLOSED: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        };
        return (
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Requests</h1>
                    <p className="text-muted-foreground">View and track your support tickets.</p>
                </div>
                <Link href="/portal/tickets/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                {!tickets || tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Ticket className="h-10 w-10 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No tickets yet</h3>
                        <p>You haven't submitted any support requests.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/portal/tickets/${ticket.id}`} className="font-semibold hover:underline">
                                            {ticket.subject}
                                        </Link>
                                        <span className="text-xs text-muted-foreground font-mono">#{ticket.id}</span>
                                        {getStatusBadge(ticket.status)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                                <div className="text-sm text-right">
                                    <div className="text-muted-foreground">
                                        {ticket.assignee ? `Agent: ${ticket.assignee.name}` : "Unassigned"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
