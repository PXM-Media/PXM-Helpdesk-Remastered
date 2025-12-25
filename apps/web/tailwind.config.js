/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}"
    ],
    presets: [require("../../packages/ui/tailwind.config.js")],
}
