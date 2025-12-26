import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@repo/ui/utils";
import { getOrganization } from "@/lib/actions/settings";
import { BrandingStyle } from "@/components/BrandingStyle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "OpenDesk",
    description: "The Best Open Source Helpdesk",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: org } = await getOrganization();

    return (
        <html lang="en">
            <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
                <BrandingStyle branding={org?.branding} />
                {children}
            </body>
        </html>
    );
}
