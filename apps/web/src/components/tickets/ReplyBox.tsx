"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { addComment } from "@/lib/actions/tickets";

export function ReplyBox({ ticketId }: { ticketId: number }) {
    const [body, setBody] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!body.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(ticketId, body, isPublic);
            setBody("");
        } catch (error) {
            console.error("Failed to submit comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-lg border bg-background shadow-sm">
            <div className="border-b px-4 py-2 bg-muted/30 flex gap-4 text-sm font-medium">
                <button
                    onClick={() => setIsPublic(true)}
                    className={`pb-2 -mb-2.5 border-b-2 transition-colors ${isPublic
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Public Reply
                </button>
                <button
                    onClick={() => setIsPublic(false)}
                    className={`pb-2 -mb-2.5 border-b-2 transition-colors ${!isPublic
                            ? "border-yellow-500 text-yellow-600 dark:text-yellow-500"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Internal Note
                </button>
            </div>
            <div className={`p-4 ${!isPublic ? "bg-yellow-50/30 dark:bg-yellow-900/10" : ""}`}>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={isPublic ? "Type a reply to the customer..." : "Leave an internal note for the team..."}
                    className="w-full min-h-[120px] resize-y bg-transparent outline-none placeholder:text-muted-foreground/60"
                />
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        {/* Formatting tools could go here */}
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !body.trim()}
                        className={!isPublic ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
                    >
                        {isSubmitting ? "Sending..." : (isPublic ? "Send Reply" : "Save Note")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
