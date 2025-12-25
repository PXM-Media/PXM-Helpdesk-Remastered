"use client";

import { createTicket } from "@/lib/actions/tickets";
import { Button } from "@repo/ui/button";
import { useFormState } from "react-dom";

// Initial state for useFormState
const initialState = {
    message: null,
};

export default function CreateTicketPage() {
    // We need to wrap createTicket to match the signature expected by useFormState
    // createTicket currently takes (formData). useFormState passes (prevState, formData).
    const [state, dispatch] = useFormState(async (prevState: any, formData: FormData) => {
        // Ignore prevState, pass formData
        const result = await createTicket(formData);
        // createTicket redirects on success, so if we are here, it failed or returned something.
        // createTicket returns { success: false, error: ... } on failure.
        if (result?.error) {
            return { message: result.error };
        }
        return { message: null };
    }, initialState);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Create New Ticket</h1>
                <p className="text-muted-foreground">Submit a new issue or question.</p>
            </div>

            <form action={dispatch} className="space-y-6 border p-6 rounded-lg bg-background">
                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <input
                        name="subject"
                        id="subject"
                        required
                        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Brief summary of the issue"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        required
                        className="w-full min-h-[150px] rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Detailed explanation..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <select
                        name="priority"
                        id="priority"
                        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                {state?.message && (
                    <div className="text-red-500 text-sm">
                        Error: {state.message}
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                    <Button type="submit">
                        Submit Ticket
                    </Button>
                </div>
            </form>
        </div>
    );
}
