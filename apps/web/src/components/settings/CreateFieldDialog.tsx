"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { createTicketField } from "@/lib/actions/fields";
import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

export function CreateFieldDialog() {
    const [isOpen, setIsOpen] = useState(false);

    // Simple toggle for now, ideally strictly a Dialog component
    // Since we don't have a Dialog component in @repo/ui clearly defined yet, 
    // I'll build a simple conditional rendering modal or just a toggle section for MVP.
    // Let's do a toggle section for speed and reliability, or a simple overlay.

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
                <h2 className="text-lg font-bold">Add Custom Field</h2>
                <form action={async (formData) => {
                    await createTicketField(formData);
                    setIsOpen(false);
                }} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Label</label>
                        <input name="title" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm" placeholder="e.g. Order Number" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select name="type" className="w-full rounded-md border bg-transparent px-3 py-2 text-sm">
                            <option value="TEXT">Text</option>
                            <option value="TEXTAREA">Text Area</option>
                            <option value="DROPDOWN">Dropdown</option>
                            <option value="CHECKBOX">Checkbox</option>
                            <option value="DATE">Date</option>
                            <option value="INTEGER">Number</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="required" id="req" className="h-4 w-4" />
                        <label htmlFor="req" className="text-sm font-medium">Required field</label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Create Field"}</Button>
}
