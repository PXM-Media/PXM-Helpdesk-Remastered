"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/utils";
import {
    LayoutDashboard,
    Inbox,
    Ticket,
    Users,
    Settings,
    BookOpen,
    BarChart3,
    Search
} from "lucide-react";

const navigation = [
    { name: "Inbox", href: "/dashboard", icon: Inbox },
    { name: "Views", href: "/dashboard/views", icon: LayoutDashboard },
    { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
    { name: "Reporting", href: "/dashboard/reporting", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <div className="h-6 w-6 rounded-md bg-zinc-900 dark:bg-zinc-50" />
                    <span>OpenDesk</span>
                </Link>
            </div>

            <div className="px-3 py-4">
                <div className="mb-4 px-2">
                    <button className="flex w-full items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
                        <Search className="h-4 w-4" />
                        <span>Search...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto border-t p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Demo Admin</span>
                        <span className="text-xs text-muted-foreground">admin@opendesk.io</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
