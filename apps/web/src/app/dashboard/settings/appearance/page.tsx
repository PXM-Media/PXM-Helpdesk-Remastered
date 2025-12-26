import { getOrganization, updateBranding } from "@/lib/actions/settings";
import { Button } from "@repo/ui/button";
import { Palette, Upload, Store } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const { data: org } = await getOrganization();
    const branding = org?.branding as any || {};

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                    Customize the look and feel of your Helpdesk portal.
                </p>
            </div>

            <form action={async (formData) => {
                "use server";
                await updateBranding(formData);
            }} className="space-y-8">

                {/* Portal Name */}
                <div className="space-y-4 border p-4 rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Store className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">Portal Identity</h4>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Portal Name</label>
                        <input
                            name="portalName"
                            defaultValue={branding.portalName || "PXM Helpdesk"}
                            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                            placeholder="e.g. Acme Support"
                        />
                        <p className="text-xs text-muted-foreground">Displayed in the browser tab and emails.</p>
                    </div>
                </div>

                {/* Logo */}
                <div className="space-y-4 border p-4 rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">Logo</h4>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Logo URL</label>
                        <input
                            name="logoUrl"
                            defaultValue={branding.logoUrl || ""}
                            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-muted-foreground">Direct link to your logo image (PNG/SVG).</p>
                    </div>
                </div>

                {/* Colors */}
                <div className="space-y-4 border p-4 rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">Theme Colors</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Primary Color</label>
                            <div className="flex gap-2">
                                <input
                                    name="primaryColor"
                                    type="color"
                                    defaultValue={branding.primaryColor || "#000000"}
                                    className="h-9 w-9 p-1 rounded-md border cursor-pointer"
                                />
                                <input
                                    type="text"
                                    defaultValue={branding.primaryColor || "#000000"}
                                    readOnly
                                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>

            </form>
        </div>
    );
}
