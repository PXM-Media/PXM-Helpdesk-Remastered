import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Login - OpenDesk",
    description: "Login to your account",
};

export default function LoginPage() {
    return (
        <main className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 p-3 mb-4 text-white dark:bg-zinc-50 dark:text-black">
                    <div className="h-6 w-6 rounded-md bg-white/20" />
                    <h1 className="text-xl font-bold">OpenDesk</h1>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
