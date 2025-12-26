import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { BrandingStyle } from "@/components/BrandingStyle"; // Reuse branding
import { getOrganization } from "@/lib/actions/settings";
import { Button } from "@repo/ui/button";
import { UserNav } from "../../components/dashboard/user-nav"; // Reuse UserNav
import Link from "next/link";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const { data: org } = await getOrganization();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
            {/* Inject Branding */}
            <BrandingStyle branding={org?.branding} />

            {/* Portal Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-xl items-center">
                    <div className="mr-4 hidden md:flex">
                        <Link href="/portal" className="mr-6 flex items-center space-x-2">
                            {org?.branding?.logoUrl ? (
                                <img src={org.branding.logoUrl} alt="Logo" className="h-6 w-auto" />
                            ) : (
                                <span className="hidden font-bold sm:inline-block">
                                    {org?.branding?.portalName || "Support Portal"}
                                </span>
                            )}
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link href="/portal/tickets" className="transition-colors hover:text-foreground/80 text-foreground">My Tickets</Link>
                            <Link href="/portal/articles" className="transition-colors hover:text-foreground/80 text-foreground/60">Help Center</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            {/* Search could go here */}
                        </div>
                        <UserNav />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container max-w-screen-xl py-6">
                {children}
            </main>

            <footer className="py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Powered by <strong>PXM Helpdesk</strong>.
                    </p>
                </div>
            </footer>
        </div>
    );
}
