"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/card";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
import { useState } from "react";
import { useToast } from "@repo/ui/use-toast";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Sending..." : "Send Reset Link"}
        </Button>
    );
}

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(formData: FormData) {
        const email = formData.get("email") as string;
        const result = await requestPasswordReset(email);

        if (result.success) {
            setSubmitted(true);
            toast({ title: "Email Sent", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!submitted ? (
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <SubmitButton />
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-100 text-green-700 p-4 rounded-md text-sm">
                                If an account matches that email, we have sent a reset link. Please check your inbox (and spam folder).
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
