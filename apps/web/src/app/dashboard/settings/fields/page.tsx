import { getTicketFields } from "@/lib/actions/fields";
import { CreateFieldDialog } from "@/components/settings/CreateFieldDialog";

export const dynamic = "force-dynamic";

export default async function FieldsSettingsPage() {
    const { data: fields } = await getTicketFields();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Ticket Fields</h3>
                    <p className="text-sm text-muted-foreground">
                        Customize the fields that appear on your ticket forms.
                    </p>
                </div>
                <CreateFieldDialog />
            </div>

            <div className="rounded-md border bg-background">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Label</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Required</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Active</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {fields?.map((field) => (
                                <tr key={field.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{field.title}</td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {field.type}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {field.requiredInPortal ? (
                                            <span className="text-red-500 text-xs font-bold">Yes</span>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">Optional</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <span className={field.active ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                            {field.active ? "Active" : "Disabled"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!fields?.length && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No custom fields defined yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
