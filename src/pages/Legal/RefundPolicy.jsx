import './Legal.css';

const UPDATED = 'July 12, 2026';
const CONTACT_EMAIL = 'arafatkhan01867160064@gmail.com';

export default function RefundPolicy() {
  return (
    <div className="wmx-legal-page">
      <div className="wmx-legal-container">
        <span className="wmx-legal-eyebrow">Legal</span>
        <h1 className="wmx-legal-title">Refund Policy</h1>
        <p className="wmx-legal-updated">Last updated: {UPDATED}</p>

        <div className="wmx-legal-section">
          <h2>1. Digital Products & Manual Payment</h2>
          <p>
            All products sold on WebMarketX are digital goods (website templates, UI kits, and
            other GitHub-repository based code). WebMarketX does not process payments — when you
            buy a paid product, you pay the seller directly (e.g. via mobile banking or bank
            transfer, coordinated over WhatsApp). Repository access is granted once the seller
            confirms your payment and marks the order as completed.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>2. No Refunds After Delivery</h2>
          <p>
            Because digital products can be copied or downloaded the moment access is granted,
            <strong> all sales are final and non-refundable</strong> once repository access has
            been delivered to the buyer. Please review the product's screenshots, description, and
            license terms carefully before paying the seller.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>3. Since Payment Is Between Buyer and Seller</h2>
          <p>
            Because WebMarketX is not involved in the payment itself, refunds are primarily a
            matter between the buyer and the seller. If you paid a seller but they haven't
            delivered access, or delivered something materially different from the listing,
            contact the seller directly first to request a refund or resolution.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>4. When WebMarketX Will Step In</h2>
          <p>We'll review and may intervene (e.g. suspend the seller, help mediate) in cases such as:</p>
          <ul>
            <li>A seller marks an order as completed without ever receiving payment from you, and grants themselves an unfair advantage — or conversely, a seller takes payment but never marks the order complete or delivers access.</li>
            <li>The product is fraudulent, materially different from its listing, or contains malicious code.</li>
          </ul>
          <p>
            To report an issue under one of these cases, use the Report button on the product page
            or contact us within 7 days at the email below with your order details. Any refund in
            these cases would need to be arranged directly with the seller, since WebMarketX never
            held the funds.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>5. Customization Requests</h2>
          <p>
            If a seller offers customization as part of a product's license terms, unresolved
            customization disputes should first be raised with the seller directly. If the seller
            fails to deliver agreed customizations, contact us and we will review the case under
            the exceptions above.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>6. Contact</h2>
          <div className="wmx-legal-contact">
            <p>Refund requests or questions about this policy: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
