"use client";

import { useState } from "react";
import { updateTicketStatus } from "@/lib/actions/tickets";

type Status = "NEW" | "OPEN" | "PENDING" | "HOLD" | "SOLVED" | "CLOSED";

const statusColors: Record<Status, string> = {
    NEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    OPEN: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    PENDING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    HOLD: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
    SOLVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    CLOSED: "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500",
};

export function StatusSelect({ ticketId, currentStatus }: { ticketId: number, currentStatus: string }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Status;
        setIsUpdating(true);
        await updateTicketStatus(ticketId, newStatus);
        setIsUpdating(false);
    };

    return (
        <div className="relative">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isUpdating}
                className={`w-full appearance-none rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 ${statusColors[currentStatus as Status] || "bg-zinc-100"}`}
            >
                <option value="NEW">New</option>
                <option value="OPEN">Open</option>
                <option value="PENDING">Pending</option>
                <option value="HOLD">On Hold</option>
                <option value="SOLVED">Solved</option>
                <option value="CLOSED">Closed</option>
            </select>
            {/* Simple chevron icon could go here via absolute positioning for style, but select default is fine for MVP speed */}
        </div>
    );
}
