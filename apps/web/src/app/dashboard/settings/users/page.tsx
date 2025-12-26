import { getUsers } from "@/lib/actions/users";
import { UserRoleSelect } from "@/components/settings/UserRoleSelect";
import { UserActionsMenu } from "@/components/settings/UserActionsMenu";
import { formatDistanceToNow } from "date-fns";

export default async function UsersSettingsPage() {
    const { data: users } = await getUsers();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Users</h3>
                <p className="text-sm text-muted-foreground">
                    Manage access and roles for your team members and customers.
                </p>
            </div>

            <div className="rounded-md border bg-background">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    User
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Role
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Joined
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Status
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users?.map((user) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                        <UserRoleSelect userId={user.id} currentRole={user.role} />
                                    </td>
                                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">
                                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                    </td>
                                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/15 text-green-700 dark:text-green-400">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                        <UserActionsMenu userId={user.id} userName={user.name} />
                                    </td>
                                </tr>
                            ))}
                            {!users?.length && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
