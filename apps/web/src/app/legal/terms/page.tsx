export const dynamic = "force-dynamic";

export default function TermsPage() {
    return (
        <>
            <h1>Terms of Service</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing and using this support portal, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
                Permission is granted to temporarily effectively use the materials (information or software) on this web site for personal,
                non-commercial transitory viewing only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
                The materials on this web site are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.
            </p>
        </>
    );
}
