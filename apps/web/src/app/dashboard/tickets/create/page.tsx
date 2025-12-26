"use client";

import { createTicket } from "@/lib/actions/tickets";
import { Button } from "@repo/ui/button";
import { useFormState } from "react-dom";

// Initial state for useFormState
const initialState = {
    message: null,
};

import { getTicketFields } from "@/lib/actions/fields";
import { DynamicTicketForm } from "@/components/tickets/DynamicTicketForm";

export const dynamic = "force-dynamic";

export default async function CreateTicketPage() {
    // Fetch active fields for the form
    const { data: fields } = await getTicketFields();
    const activeFields = fields?.filter(f => f.active) || [];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Create New Ticket</h1>
                <p className="text-muted-foreground">
                    Submit a new issue to the support team.
                </p>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <DynamicTicketForm fields={activeFields} />
            </div>
        </div>
    );
}
