"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { MoreHorizontal, Download, Trash2, UserX } from "lucide-react";
import { exportUserData, anonymizeUser } from "@/lib/actions/privacy";
import { toast } from "@repo/ui/use-toast";

interface UserActionsMenuProps {
    userId: string;
    userName: string;
}

export function UserActionsMenu({ userId, userName }: UserActionsMenuProps) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        const result = await exportUserData(userId);
        setLoading(false);

        if (result.success && result.data) {
            // Trigger download
            const blob = new Blob([result.data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `user-export-${userId}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({ title: "Export Successful", description: "User data downloaded." });
        } else {
            toast({ title: "Export Failed", description: result.error, variant: "destructive" });
        }
    };

    const handleAnonymize = async () => {
        if (!confirm(`Are you sure you want to anonymize ${userName}? This action cannot be undone!`)) return;

        setLoading(true);
        const result = await anonymizeUser(userId);
        setLoading(false);

        if (result.success) {
            toast({ title: "User Anonymized", description: "Personal data has been removed." });
        } else {
            toast({ title: "Action Failed", description: result.error, variant: "destructive" });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>GDPR / Privacy</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExport} disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAnonymize} disabled={loading} className="text-red-600 focus:text-red-600">
                    <UserX className="mr-2 h-4 w-4" />
                    Anonymize User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
