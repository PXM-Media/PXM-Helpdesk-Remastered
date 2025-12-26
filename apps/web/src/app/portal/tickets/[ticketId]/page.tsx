import { getTicket, addComment } from "@/lib/actions/tickets";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Separator } from "@repo/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Textarea } from "@repo/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export default async function PortalTicketDetailPage({ params }: { params: { ticketId: string } }) {
    const ticketId = parseInt(params.ticketId);
    if (isNaN(ticketId)) return notFound();

    const { data: ticket } = await getTicket(ticketId);
    if (!ticket) return notFound();

    const session = await auth();

    // Verify ownership (Security)
    if (ticket.requesterId !== session?.user?.id) {
        // In a real app, maybe show 403 or Not Found
        return notFound();
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {ticket.subject}
                        </h1>
                        <Badge variant={ticket.status === "SOLVED" ? "secondary" : "default"}>
                            {ticket.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Request #{ticket.id} • Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </p>
                </div>

                {/* Conversation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conversation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Initial Description */}
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={ticket.requester?.image || ""} />
                                <AvatarFallback>{ticket.requester?.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{ticket.requester?.name}</span>
                                    <span className="text-xs text-muted-foreground">started the request</span>
                                </div>
                                <div className="text-sm bg-muted/50 p-3 rounded-md">
                                    {ticket.description}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Comments */}
                        {ticket.comments.filter(c => c.public).map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={comment.author?.image || ""} />
                                    <AvatarFallback>{comment.author?.name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{comment.author?.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        {comment.body}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Reply Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add a Reply</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            action={async (formData) => {
                                "use server";
                                const body = formData.get("body") as string;
                                if (body) {
                                    await addComment(ticketId, body, true); // Always public from portal
                                }
                            }}
                            className="space-y-4"
                        >
                            <Textarea
                                name="body"
                                placeholder="Type your reply here..."
                                required
                                className="min-h-[100px]"
                            />
                            <div className="flex justify-end">
                                <Button type="submit">Send Reply</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                {/* Sidebar Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Ticket Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block text-xs">Priority</span>
                            <span className="font-medium">{ticket.priority}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs">Assignee</span>
                            <span className="font-medium">{ticket.assignee?.name || "Unassigned"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
