"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { cn } from "@repo/ui/utils";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Simple delay for smoother entrance
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:max-w-md animate-in slide-in-from-bottom duration-500">
            <Card className="p-4 shadow-xl border-primary/20 bg-background/95 backdrop-blur">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
                        <Cookie className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-sm">We use cookies 🍪</h3>
                        <p className="text-xs text-muted-foreground">
                            We use cookies to ensure you get the best experience on our website.
                            By continuing to use the site, you agree to our use of cookies.
                            <Link href="/legal/privacy" className="underline hover:text-primary ml-1">
                                Learn more
                            </Link>
                        </p>
                        <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={accept} className="w-full">
                                Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={accept} className="w-full">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
