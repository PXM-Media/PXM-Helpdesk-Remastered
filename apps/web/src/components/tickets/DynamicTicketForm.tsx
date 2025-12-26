"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTicket } from "@/lib/actions/tickets";
import { Button } from "@repo/ui/button";
import { AlertCircle } from "lucide-react";

type Field = {
    id: string;
    title: string;
    type: "TEXT" | "TEXTAREA" | "DROPDOWN" | "CHECKBOX" | "DATE" | "INTEGER" | "DECIMAL";
    requiredInPortal: boolean | null;
    active: boolean | null;
    options: unknown;
    key: string | null;
}

export function DynamicTicketForm({ fields }: { fields: Field[] }) {
    // Initial state matching the server action return type
    const initialState = { success: false, error: "", fieldErrors: {} };
    const [state, dispatch] = useFormState(createTicket, initialState);

    return (
        <form action={dispatch} className="space-y-6">
            {state?.error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                    Subject <span className="text-red-500">*</span>
                </label>
                <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief summary of the issue"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="LOW">Low - It's annoying, but I can work</option>
                    <option value="NORMAL">Normal - Standard issue</option>
                    <option value="HIGH">High - Important functionality is broken</option>
                    <option value="URGENT">Urgent - System is down</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Please describe the issue in detail..."
                />
            </div>

            {/* Dynamic Custom Fields */}
            {fields.length > 0 && (
                <div className="pt-4 border-t space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Additional Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {fields.map(field => (
                            <CustomFieldInput key={field.id} field={field} />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}

function CustomFieldInput({ field }: { field: Field }) {
    const inputName = `custom_${field.id}`;

    return (
        <div className="space-y-2">
            <label htmlFor={inputName} className="text-sm font-medium">
                {field.title} {field.requiredInPortal && <span className="text-red-500">*</span>}
            </label>

            {field.type === "TEXT" && (
                <input
                    id={inputName}
                    name={inputName}
                    type="text"
                    required={!!field.requiredInPortal}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            )}
            {field.type === "INTEGER" && (
                <input
                    id={inputName}
                    name={inputName}
                    type="number"
                    step="1"
                    required={!!field.requiredInPortal}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            )}
            {field.type === "DATE" && (
                <input
                    id={inputName}
                    name={inputName}
                    type="date"
                    required={!!field.requiredInPortal}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            )}
            {field.type === "CHECKBOX" && (
                <div className="flex items-center h-10">
                    <input
                        id={inputName}
                        name={inputName}
                        type="checkbox"
                        required={!!field.requiredInPortal}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                </div>
            )}
            {field.type === "DROPDOWN" && (
                <select
                    id={inputName}
                    name={inputName}
                    required={!!field.requiredInPortal}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <option value="">Select...</option>
                    {/* Options handling would go here, currently using basic JSONB */}
                </select>
            )}
            {field.type === "TEXTAREA" && (
                <textarea
                    id={inputName}
                    name={inputName}
                    required={!!field.requiredInPortal}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            )}
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Ticket"}
        </Button>
    );
}
