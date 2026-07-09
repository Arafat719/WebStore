import './Legal.css';

const UPDATED = 'July 9, 2026';
const CONTACT_EMAIL = 'arafatkhan01867160064@gmail.com';

export default function TermsOfUse() {
  return (
    <div className="wmx-legal-page">
      <div className="wmx-legal-container">
        <span className="wmx-legal-eyebrow">Legal</span>
        <h1 className="wmx-legal-title">Terms of Use</h1>
        <p className="wmx-legal-updated">Last updated: {UPDATED}</p>

        <div className="wmx-legal-section">
          <h2>1. About WebMarketX</h2>
          <p>
            WebMarketX ("we", "us", "the platform") is a digital marketplace where sellers list
            web-based digital products (websites, templates, UI kits, and other GitHub-repository
            based code) and buyers purchase access to those products. WebMarketX is operated as an
            individual project based in Bangladesh and is not a registered company.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>2. Accounts</h2>
          <p>
            You must create an account to buy or sell on WebMarketX. You are responsible for
            keeping your login credentials secure and for all activity that happens under your
            account. You must provide accurate information when signing up, whether directly or
            via Google/Facebook sign-in.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>3. Buyers</h2>
          <ul>
            <li>Payments are processed by our third-party payment provider (e.g. Paddle). WebMarketX does not store your card details.</li>
            <li>After a successful payment, you get access to the product's GitHub repository as described on the product page.</li>
            <li>Digital products are delivered instantly upon payment. Because of this, <strong>all sales are final and non-refundable</strong> once access has been granted, except where required by law.</li>
            <li>If a product is materially different from its listing, contact the seller first, then reach us at the email below.</li>
          </ul>
        </div>

        <div className="wmx-legal-section">
          <h2>4. Sellers</h2>
          <ul>
            <li>Becoming a seller is free. You must own or have the right to sell any product you list.</li>
            <li>You are responsible for the accuracy of your product listings, pricing, and license terms.</li>
            <li>If a buyer requests reasonable customization of a purchased product under the license terms you set, you are expected to complete those changes before payment is released to you.</li>
            <li>WebMarketX reserves the right to remove any listing that violates these terms, contains malicious code, infringes third-party rights, or is otherwise unlawful.</li>
          </ul>
        </div>

        <div className="wmx-legal-section">
          <h2>5. Payments</h2>
          <p>
            Payments on WebMarketX are handled by a licensed third-party payment processor. That
            processor may act as merchant of record for your purchase, meaning your transaction may
            appear under their name on your bank/card statement. Their terms and policies apply to
            the payment itself in addition to these Terms.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>6. Prohibited Use</h2>
          <ul>
            <li>Uploading malicious, pirated, or illegal content.</li>
            <li>Attempting to defraud buyers or sellers, or bypass the platform's payment system.</li>
            <li>Scraping, reverse-engineering, or disrupting the platform's infrastructure.</li>
          </ul>
        </div>

        <div className="wmx-legal-section">
          <h2>7. Disclaimer & Liability</h2>
          <p>
            WebMarketX provides the marketplace "as is" and does not guarantee the quality,
            security, or fitness of any product listed by a seller. To the extent permitted by
            law, WebMarketX is not liable for indirect, incidental, or consequential damages
            arising from use of the platform or any product purchased through it.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>8. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of WebMarketX after changes
            are posted means you accept the updated Terms.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>9. Governing Law</h2>
          <p>These Terms are governed by the laws of Bangladesh.</p>
        </div>

        <div className="wmx-legal-section">
          <h2>10. Contact</h2>
          <div className="wmx-legal-contact">
            <p>Questions about these Terms? Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
