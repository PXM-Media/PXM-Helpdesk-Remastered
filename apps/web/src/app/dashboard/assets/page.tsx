import { getAssets, deleteAsset } from "@/lib/actions/assets";
import { Button } from "@repo/ui/button";
import { Laptop, Tag, Trash2, Plus, Monitor, Box, Key } from "lucide-react";
import { CreateAssetDialog } from "@/components/assets/CreateAssetDialog";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
    const { data: assets } = await getAssets();

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "HARDWARE": return <Laptop className="h-5 w-5 text-blue-500" />;
            case "SOFTWARE": return <Box className="h-5 w-5 text-purple-500" />;
            case "LICENSE": return <Key className="h-5 w-5 text-yellow-500" />;
            case "PERIPHERAL": return <Monitor className="h-5 w-5 text-green-500" />;
            default: return <Tag className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            AVAILABLE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            MAINTENANCE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            RETIRED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
            LOST: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        };
        return (
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles[status] || styles.RETIRED}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Assets</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage hardware, licenses, and inventory.
                    </p>
                </div>
                <CreateAssetDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets?.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4 bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                    {getTypeIcon(asset.type)}
                                </div>
                                <div className="text-xs font-mono text-muted-foreground">{asset.tag}</div>
                            </div>
                            {getStatusBadge(asset.status)}
                        </div>

                        <h4 className="font-semibold">{asset.name}</h4>

                        {asset.assignedTo && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground border-t pt-2">
                                <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                    {asset.assignedTo.name?.charAt(0)}
                                </div>
                                <span>Assigned to {asset.assignedTo.name}</span>
                            </div>
                        )}

                        {!asset.assignedTo && (
                            <div className="mt-4 text-sm text-muted-foreground border-t pt-2 italic">
                                Unassigned
                            </div>
                        )}

                        <div className="mt-4 pt-2 border-t flex justify-end">
                            <form action={async () => {
                                "use server";
                                await deleteAsset(asset.id);
                            }}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {(!assets || assets.length === 0) && (
                <div className="flex flex-col items-center justify-center h-40 border rounded-lg border-dashed text-muted-foreground">
                    <Laptop className="h-8 w-8 mb-2 opacity-50" />
                    <p>No assets found.</p>
                </div>
            )}
        </div>
    );
}
