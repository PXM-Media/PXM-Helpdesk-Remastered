import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Navbar } from "@/components/marketing/Navbar";
import { ArrowRight, CheckCircle2, Shield, Zap, MessageSquare } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 bg-zinc-100 dark:bg-zinc-900">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        v1.0 Now Available
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                        Customer Support <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            Reimagined.
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
                        Delight your customers with a lightning-fast helpdesk.
                        Built for modern teams who care about speed and simplicity.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base">
                                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/dashboard/tickets/create">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                                Report an Issue
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white dark:bg-black border-y border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to scale</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">Powerful features directly out of the box.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <FeatureCard
                            icon={Zap}
                            title="Lightning Fast"
                            description="Optimized for speed. No loading spinners, just instant transitions."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Enterprise Security"
                            description="Bank-grade encryption, secure authentication, and role-based access."
                        />
                        <FeatureCard
                            icon={MessageSquare}
                            title="Real-time Chat"
                            description="Connect with your customers instantly with our integrated chat engine."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 text-center text-sm text-muted-foreground">
                <div className="container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} OpenDesk Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {description}
            </p>
        </div>
    )
}
