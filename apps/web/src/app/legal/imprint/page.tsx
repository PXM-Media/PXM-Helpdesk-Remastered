export const dynamic = "force-dynamic";

export default function ImprintPage() {
    return (
        <>
            <h1>Imprint (Impressum)</h1>
            <p>Information according to &sect; 5 TMG</p>

            <h2>Operator</h2>
            <p>
                <strong>[Company Name]</strong><br />
                [Street Address]<br />
                [City, Zip Code]<br />
                [Country]
            </p>

            <h2>Contact</h2>
            <p>
                Phone: [Phone Number]<br />
                Email: [Email Address]
            </p>

            <h2>Represented by</h2>
            <p>
                [Managing Director Name]
            </p>

            <h2>Register Entry</h2>
            <p>
                Entry in the commercial register.<br />
                Registering court: [Local Court]<br />
                Registration number: [HRB Number]
            </p>

            <h2>VAT ID</h2>
            <p>
                Sales tax identification number according to &sect; 27 a of the Sales Tax Law:<br />
                [DE 123 456 789]
            </p>
        </>
    );
}
