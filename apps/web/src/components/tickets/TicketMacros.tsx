"use client";

import { applyMacro } from "@/lib/actions/macros";
import { Button } from "@repo/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { useToast } from "@repo/ui/use-toast";
import { Zap } from "lucide-react";
import { useState } from "react";

interface TicketMacrosProps {
    ticketId: number;
    macros: { id: string; title: string; description: string | null }[];
}

export function TicketMacros({ ticketId, macros }: TicketMacrosProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    if (macros.length === 0) return null;

    const handleApply = async (macroId: string, macroTitle: string) => {
        setLoading(true);
        try {
            const result = await applyMacro(ticketId, macroId);
            if (result.success) {
                toast({
                    title: "Macro Applied",
                    description: `Applied '${macroTitle}' successfully.`
                });
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to apply macro",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" disabled={loading}>
                    <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {loading ? "Applying..." : "Macros"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Apply Macro</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {macros.map((macro) => (
                    <DropdownMenuItem
                        key={macro.id}
                        onClick={() => handleApply(macro.id, macro.title)}
                        className="flex flex-col items-start gap-1 cursor-pointer"
                    >
                        <span className="font-medium">{macro.title}</span>
                        {macro.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                                {macro.description}
                            </span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
