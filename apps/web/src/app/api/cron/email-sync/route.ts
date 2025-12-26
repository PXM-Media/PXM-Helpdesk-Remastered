import { db } from "@repo/database";
import { emailSettings } from "@repo/database/schema";
import { syncEmailsForOrganization } from "@/lib/email/imap-service";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// Prevents Vercel/Next from caching this route, ensures it runs fresh every time.
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        console.log("[Cron] Starting email sync...");

        const allSettings = await db.query.emailSettings.findMany({
            where: eq(emailSettings.enabled, true),
        });

        if (allSettings.length === 0) {
            return NextResponse.json({ message: "No enabled email settings found." });
        }

        // Process sequentially to manage connections, or parallel if scaling
        for (const setting of allSettings) {
            await syncEmailsForOrganization(setting);
        }

        return NextResponse.json({ success: true, processed: allSettings.length });
    } catch (error) {
        console.error("[Cron] Email sync error:", error);
        return NextResponse.json({ error: "Sync failed" }, { status: 500 });
    }
}
