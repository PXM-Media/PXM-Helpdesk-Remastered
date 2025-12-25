export function Header() {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                {/* Breadcrumbs or Title could go here */}
                <h1 className="text-sm font-medium text-muted-foreground">Inbox</h1>
            </div>
            <div className="flex items-center gap-4">
                {/* Actions */}
                <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">Online</span>
            </div>
        </header>
    );
}
