export const dynamic = "force-dynamic";

export default function PrivacyPolicyPage() {
    return (
        <>
            <h1>Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>
                We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data
                and tell you about your privacy rights and how the law protects you.
            </p>

            <h2>2. Data We Collect</h2>
            <p>
                We may collect, use, store and transfer different kinds of personal data about you
                which we have grouped together follows:
            </p>
            <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
                to provide support services, manage our relationship with you, and improve our website/app.
            </p>

            {/* Add more real content here in production */}
        </>
    );
}
