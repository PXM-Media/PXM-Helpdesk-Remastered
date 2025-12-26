import { Inbox, Settings, Users, Laptop, BookOpen, BarChart3 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-6 dark:bg-zinc-900/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
