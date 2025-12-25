import { getTickets } from "@/lib/actions/tickets";
import { Inbox, Tag, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"; // We might need to install this

export default async function DashboardPage() {
    const { data: tickets, success } = await getTickets();

    if (!success || !tickets || tickets.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                    <Inbox className="h-8 w-8 text-zinc-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Inbox Zero</h2>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        You're all caught up! No open tickets requiring your attention.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
                {/* Add Create Ticket Button here later */}
            </div>

            <div className="divide-y rounded-md border bg-background shadow-sm">
                {tickets.map((ticket) => (
                    <Link
                        key={ticket.id}
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{ticket.subject}</span>
                                    <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ticket.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                                            ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {ticket.priority}
                                    </span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <UserIcon className="h-3 w-3" />
                                        <span>{ticket.requester?.name || "Unknown"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ticket.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                                    ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {ticket.status}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
