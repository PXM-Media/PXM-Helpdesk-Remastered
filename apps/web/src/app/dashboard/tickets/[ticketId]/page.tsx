import { getTicket } from "@/lib/actions/tickets";
import { ReplyBox } from "@/components/tickets/ReplyBox";
import { StatusSelect } from "@/components/tickets/StatusSelect";
import { formatDistanceToNow } from "date-fns";
import { User as UserIcon, MessageSquare, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export default async function TicketDetailPage({ params }: { params: { ticketId: string } }) {
    const ticketId = parseInt(params.ticketId);
    const { data: ticket, success } = await getTicket(ticketId);

    if (!success || !ticket) {
        notFound();
    }

    return (
        <div className="flex h-full flex-col lg:flex-row gap-6">
            {/* Main Content: Conversation */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">{ticket.subject}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <span>via Web</span>
                    </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto">
                    {/* Original Request (First Comment effectively) */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-100">
                                {ticket.requester?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">{ticket.requester?.name}</span>
                                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
                                <p>{ticket.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Comments Feed */}
                    {ticket.comments.map((comment) => (
                        <div key={comment.id} className={`flex gap-4 ${!comment.public ? 'bg-yellow-50/50 p-4 rounded-md border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/30' : ''}`}>
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold dark:bg-zinc-800 dark:text-zinc-300">
                                    {comment.author?.name?.charAt(0).toUpperCase() || "A"}
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{comment.author?.name}</span>
                                        {!comment.public && <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-mono">Internal Note</span>}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
                                    <p>{comment.body}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Area */}
                <div className="pt-4 border-t">
                    <ReplyBox ticketId={ticket.id} />
                </div>
            </div>

            {/* Sidebar: Properties */}
            <div className="w-full lg:w-80 border-l pl-0 lg:pl-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Properties</h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-muted-foreground self-center">Status</div>
                        <div>
                            <StatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
                        </div>

                        <div className="text-muted-foreground">Priority</div>
                        <div className="font-medium">{ticket.priority}</div>

                        <div className="text-muted-foreground">Assignee</div>
                        <div className="font-medium flex items-center gap-1.5">
                            {ticket.assignee ? (
                                <>
                                    <div className="h-5 w-5 rounded-full bg-zinc-200" />
                                    {ticket.assignee.name}
                                </>
                            ) : (
                                <span className="text-muted-foreground italic">Unassigned</span>
                            )}
                        </div>

                        <div className="text-muted-foreground">Requester</div>
                        <div className="font-medium flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-blue-100" />
                            {ticket.requester?.name}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-zinc-100 text-xs font-medium dark:bg-zinc-800">
                            support
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-zinc-100 text-xs font-medium dark:bg-zinc-800">
                            web
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
