import Image from "next/image";
import { cn } from "@repo/ui/utils";

interface LogoProps {
    src?: string | null;
    className?: string;
}

export function Logo({ src, className }: LogoProps) {
    if (!src) {
        return (
            <div className={cn("h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold", className)}>
                S
            </div>
        );
    }

    return (
        <div className={cn("relative h-8 w-8 rounded-lg overflow-hidden", className)}>
            <Image
                src={src}
                alt="Logo"
                fill
                className="object-cover"
            />
        </div>
    );
}
