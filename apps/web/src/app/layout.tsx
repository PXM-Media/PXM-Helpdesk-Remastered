import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@repo/ui/toaster"; // Not yet implemented
// import { ThemeProvider } from "@/components/theme-provider"; // Not yet implemented
import { SessionProvider } from "next-auth/react";
import { getOrganization } from "@/lib/actions/settings";
import { BrandingStyle } from "@/components/BrandingStyle"; // Import client component
import { cn } from "@repo/ui/utils"; // Correct path based on package export
import { isSystemInitialized } from "@/lib/actions/setup";
import { CookieConsent } from "@/components/legal/cookie-consent";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PXM Helpdesk",
    description: "Advanced Helpdesk Solution",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialized = await isSystemInitialized();
    // See middleware or page-level checks for redirect logic to avoid circular deps/headers issues here.

    // Fetch branding (only if initialized essentially, but safe to try)
    const { data: org } = await getOrganization();

    return (
        <html lang="en">
            <body className={cn(inter.className, "antialiased")}>
                <SessionProvider>
                    <BrandingStyle branding={org?.branding} />
                    {children}
                    <CookieConsent />
                </SessionProvider>
            </body>
        </html>
    );
}
