import { Inbox } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                <Inbox className="h-8 w-8 text-zinc-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Inbox Zero</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                    You're all caught up! No open tickets requiring your attention.
                </p>
            </div>
        </div>
    );
}
