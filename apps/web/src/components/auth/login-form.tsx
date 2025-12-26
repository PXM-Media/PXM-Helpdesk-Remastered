"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/lib/actions/auth";
import { Button } from "@repo/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <form action={dispatch} className="space-y-3 rounded-lg bg-white px-6 pb-4 pt-8 shadow-sm dark:bg-black border">
            <div className="w-full">
                <div>
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-zinc-900 dark:text-zinc-50"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-zinc-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="admin@opendesk.io"
                            required
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-zinc-900 dark:text-zinc-50"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-zinc-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="password"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end mt-1">
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
            </div>
            <LoginButton />
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
        </form >
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full" aria-disabled={pending} disabled={pending}>
            Log in
        </Button>
    );
}
