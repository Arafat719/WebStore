import './Legal.css';

const UPDATED = 'July 12, 2026';
const CONTACT_EMAIL = 'arafatkhan01867160064@gmail.com';

export default function PrivacyPolicy() {
  return (
    <div className="wmx-legal-page">
      <div className="wmx-legal-container">
        <span className="wmx-legal-eyebrow">Legal</span>
        <h1 className="wmx-legal-title">Privacy Policy</h1>
        <p className="wmx-legal-updated">Last updated: {UPDATED}</p>

        <div className="wmx-legal-section">
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains what data WebMarketX collects when you use our
            marketplace, how we use it, and who we share it with. By using WebMarketX, you agree
            to the collection and use of information as described here.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>2. Information We Collect</h2>
          <ul>
            <li><strong>Account data:</strong> name, email address, and password (stored securely hashed) when you sign up directly, or your name/email/profile picture when you sign up via Google or Facebook.</li>
            <li><strong>Profile data:</strong> profile picture (hosted via Cloudinary), bio, and seller information if you become a seller.</li>
            <li><strong>Product & order data:</strong> products you list or purchase, order history, and messages related to customization requests.</li>
            <li><strong>Payment data:</strong> WebMarketX does not process payments and never collects, sees, or stores your card or payment details. Buyers and sellers arrange and complete payment directly with each other, outside the platform.</li>
            <li><strong>Usage data:</strong> basic technical data such as login sessions (via authentication tokens) and support/chat messages if you use our live chat widget.</li>
          </ul>
        </div>

        <div className="wmx-legal-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account, and to let you buy or sell products.</li>
            <li>To process orders and grant access to purchased products (e.g. GitHub repositories).</li>
            <li>To send account-related notifications (e.g. order updates, password reset).</li>
            <li>To respond to support requests.</li>
            <li>To keep the platform secure and prevent fraud or abuse.</li>
          </ul>
        </div>

        <div className="wmx-legal-section">
          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services, each of which processes limited data on our behalf:</p>
          <ul>
            <li><strong>Google Sign-In / Facebook Login</strong> — for account authentication.</li>
            <li><strong>Cloudinary</strong> — for storing and serving uploaded profile/product images.</li>
            <li><strong>Live chat widget (Tawk.to)</strong> — for customer support conversations.</li>
            <li><strong>WhatsApp</strong> — buyers and sellers may be shown each other's WhatsApp contact to arrange payment and communicate about an order; WebMarketX does not see the content of those conversations.</li>
          </ul>
        </div>

        <div className="wmx-legal-section">
          <h2>5. Cookies & Local Storage</h2>
          <p>
            We use your browser's local storage to keep you logged in (authentication token) and
            to remember preferences such as light/dark theme. We do not use tracking cookies for
            advertising purposes.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>6. Data Sharing</h2>
          <p>
            We do not sell your personal data. We only share data with the third-party services
            listed above, as needed to operate the platform, or when required by law.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>7. Data Retention & Deletion</h2>
          <p>
            We keep your account data for as long as your account is active. You can request
            deletion of your account and associated personal data at any time by emailing us at
            the address below.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>8. Your Rights</h2>
          <p>
            You can access, correct, or delete your personal information via your account
            Settings, or by contacting us directly for requests we can't handle in-app.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>9. Children's Privacy</h2>
          <p>WebMarketX is not directed at children under 13, and we do not knowingly collect data from them.</p>
        </div>

        <div className="wmx-legal-section">
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be reflected by updating the "Last updated" date above.</p>
        </div>

        <div className="wmx-legal-section">
          <h2>11. Contact</h2>
          <div className="wmx-legal-contact">
            <p>Questions about this Privacy Policy? Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
