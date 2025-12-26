import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Zap className="mr-2 h-6 w-6" />
                    OpenDesk
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This library has saved me countless hours of work and
                            helped me deliver stunning designs to my clients faster than
                            ever before.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis, CTO at Acme Inc</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 relative h-screen flex justify-center items-center">
                <Link
                    href="/"
                    className="absolute right-4 top-4 md:right-8 md:top-8 text-sm font-medium hover:text-primary transition-colors"
                >
                    Back to Home
                </Link>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Login to your account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <LoginForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Request access from your administrator if you don't have an account.
                    </p>
                </div>
            </div>
        </div>
    );
}
