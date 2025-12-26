"use client";

import { useState } from "react";
import { updateUserRole } from "@/lib/actions/users";
import { Loader2 } from "lucide-react";

type Role = "ADMIN" | "AGENT" | "END_USER";

const roleLabels: Record<Role, string> = {
    ADMIN: "Administrator",
    AGENT: "Support Agent",
    END_USER: "Customer",
};

export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: Role }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role;
        setIsUpdating(true);
        await updateUserRole(userId, newRole);
        setIsUpdating(false);
    };

    return (
        <div className="relative max-w-[140px]">
            <select
                value={currentRole}
                onChange={handleChange}
                disabled={isUpdating}
                className="w-full appearance-none rounded-md border bg-transparent px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
                <option value="ADMIN">{roleLabels.ADMIN}</option>
                <option value="AGENT">{roleLabels.AGENT}</option>
                <option value="END_USER">{roleLabels.END_USER}</option>
            </select>
            {isUpdating && <Loader2 className="absolute right-2 top-2 h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
    );
}
