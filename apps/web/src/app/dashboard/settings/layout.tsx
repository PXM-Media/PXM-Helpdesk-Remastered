"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/utils";
import { Users, Settings, Tag, Shield } from "lucide-react";

const settingsNav = [
    { name: "General", href: "/dashboard/settings", icon: Settings },
    { name: "Users & Roles", href: "/dashboard/settings/users", icon: Users },
    { name: "Fields & Forms", href: "/dashboard/settings/fields", icon: Tag },
    { name: "Security", href: "/dashboard/settings/security", icon: Shield },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
                <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                    {settingsNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "justify-start rounded-md p-2 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 flex items-center gap-2",
                                pathname === item.href
                                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
    );
}
