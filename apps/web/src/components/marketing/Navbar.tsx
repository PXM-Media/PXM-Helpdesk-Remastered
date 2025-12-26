"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg tracking-tight">OpenDesk</span>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                    Login
                </Link>
                <Link href="/dashboard/tickets/create">
                    <Button size="sm">Submit Ticket</Button>
                </Link>
            </div>
        </nav>
    );
}
