"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { createAsset } from "@/lib/actions/assets";
import { Plus, Laptop, Save } from "lucide-react";
import { useFormStatus } from "react-dom";

export function CreateAssetDialog() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <Laptop className="h-5 w-5" />
                    <h2 className="text-lg font-bold">New Asset</h2>
                </div>

                <form action={async (formData) => {
                    await createAsset(formData);
                    setIsOpen(false);
                }} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Asset Name</label>
                            <input name="name" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm" placeholder="e.g. MacBook Pro" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tag / Serial</label>
                            <input name="tag" className="w-full rounded-md border bg-transparent px-3 py-2 text-sm" placeholder="e.g. AST-001" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select name="type" className="w-full rounded-md border bg-transparent px-3 py-2 text-sm">
                                <option value="HARDWARE">Hardware</option>
                                <option value="SOFTWARE">Software</option>
                                <option value="LICENSE">License</option>
                                <option value="PERIPHERAL">Peripheral</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select name="status" className="w-full rounded-md border bg-transparent px-3 py-2 text-sm">
                                <option value="AVAILABLE">Available</option>
                                <option value="ASSIGNED">Assigned</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="RETIRED">Retired</option>
                                <option value="LOST">Lost</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes</label>
                        <textarea name="notes" className="w-full rounded-md border bg-transparent px-3 py-2 text-sm" rows={3}></textarea>
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
    return <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Create Asset"}</Button>
}
