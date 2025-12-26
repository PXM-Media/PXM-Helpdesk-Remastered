import { getAnalyticsData } from "@/lib/actions/analytics";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const result = await getAnalyticsData();

    if (!result.success || !result.data) {
        return <div className="p-4 text-red-500">Failed to load analytics data.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                    Overview of helpdesk performance and ticket volume.
                </p>
            </div>

            <AnalyticsClient data={result.data} />
        </div>
    );
}
