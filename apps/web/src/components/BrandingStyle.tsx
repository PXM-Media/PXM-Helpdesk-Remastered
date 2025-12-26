"use client";

import { useEffect } from "react";

type BrandingProps = {
    branding?: {
        logoUrl?: string;
        primaryColor?: string;
        portalName?: string;
    } | null;
};

export function BrandingStyle({ branding }: BrandingProps) {
    useEffect(() => {
        if (branding?.primaryColor) {
            document.documentElement.style.setProperty("--primary", hexToHsl(branding.primaryColor));
            // You might need to adjust other variables derived from primary
        }
        if (branding?.portalName) {
            document.title = branding.portalName;
        }
        if (branding?.logoUrl) {
            // Logic to update logo if possible, or just rely on image src checks elsewhere
        }
    }, [branding]);

    return null;
}

// Helper to convert Hex to HSL for Shadcn/Tailwind (which usually expects H S% L%)
// Tailwind CSS variables in this project likely expect "H S% L%" format (without hsl()) 
// or maybe standard CSS colors. Let's assume standard hex is NOT what works if it uses --primary: 0 0% 9%.
// If global.css uses HSL values (e.g. 222.2 47.4% 11.2%), we must convert.
function hexToHsl(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `${h} ${s}% ${l}%`;
}
