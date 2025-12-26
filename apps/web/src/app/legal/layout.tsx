import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ArrowLeft } from "lucide-react";
import { getOrganization } from "@/lib/actions/settings";
import { Logo } from "@/components/Logo";

export default async function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: org } = await getOrganization();

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Logo src={org?.branding?.logoUrl} />
                        <span className="hidden font-bold sm:inline-block">
                            {org?.branding?.portalName || org?.name || "Support"}
                        </span>
                    </Link>
                    <div className="ml-auto">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to App
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="container py-10 max-w-4xl">
                <div className="bg-card p-8 rounded-lg border shadow-sm prose prose-zinc dark:prose-invert max-w-none">
                    {children}
                </div>
            </main>
            <footer className="py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} {org?.name}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
