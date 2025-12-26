"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/auth";
import { useState, Suspense } from "react";
import { useToast } from "@repo/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Resetting..." : "Set New Password"}
        </Button>
    );
}

function ResetPasswordForm() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <Card className="w-full max-w-sm text-center p-6">
                <h2 className="text-xl font-bold text-destructive mb-2">Invalid Link</h2>
                <p className="text-sm text-muted-foreground mb-4">This password reset link is invalid or missing.</p>
                <Link href="/login" className="text-primary hover:underline">Back to Login</Link>
            </Card>
        );
    }

    async function handleSubmit(formData: FormData) {
        const password = formData.get("password") as string;
        const confirm = formData.get("confirm") as string;

        if (password !== confirm) {
            toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
            return;
        }

        const result = await resetPassword(token!, password);

        if (result.success) {
            setSuccess(true);
            toast({ title: "Success", description: "Your password has been reset." });
            setTimeout(() => router.push("/login"), 2000);
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!success ? (
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <Input id="confirm" name="confirm" type="password" required />
                        </div>
                        <SubmitButton />
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-green-100 text-green-700 p-4 rounded-md text-sm">
                            Password reset successful! Redirecting to login...
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
