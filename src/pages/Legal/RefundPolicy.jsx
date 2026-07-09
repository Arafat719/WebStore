import './Legal.css';

const UPDATED = 'July 9, 2026';
const CONTACT_EMAIL = 'arafatkhan01867160064@gmail.com';

export default function RefundPolicy() {
  return (
    <div className="wmx-legal-page">
      <div className="wmx-legal-container">
        <span className="wmx-legal-eyebrow">Legal</span>
        <h1 className="wmx-legal-title">Refund Policy</h1>
        <p className="wmx-legal-updated">Last updated: {UPDATED}</p>

        <div className="wmx-legal-section">
          <h2>1. Digital Products</h2>
          <p>
            All products sold on WebMarketX are digital goods (website templates, UI kits, and
            other GitHub-repository based code). Access to the purchased product is granted
            instantly after a successful payment.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>2. No Refunds After Delivery</h2>
          <p>
            Because digital products are delivered instantly and can be copied or downloaded the
            moment access is granted, <strong>all sales are final and non-refundable</strong> once
            repository access has been delivered to the buyer. Please review the product's
            screenshots, description, and license terms carefully before purchasing.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>3. Exceptions</h2>
          <p>We may consider a refund only in the following limited cases:</p>
          <ul>
            <li>You were charged more than once for the same order due to a technical error.</li>
            <li>The payment was completed but you never received access to the product (delivery failure on our end).</li>
            <li>The product is fraudulent, materially different from its listing, or contains malicious code.</li>
          </ul>
          <p>
            To request a refund under one of these exceptions, contact us within 7 days of
            purchase with your order details. Approved refunds are processed back to your original
            payment method through our payment processor and may take several business days to
            appear.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>4. Failed or Cancelled Payments</h2>
          <p>
            If a payment fails or is cancelled before completion, you are not charged and no
            product access is granted. You may retry the purchase at any time.
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
          <h2>6. Payment Processor</h2>
          <p>
            Payments are processed by our third-party payment provider (e.g. Paddle), who may
            apply their own dispute and chargeback procedures in addition to this policy.
          </p>
        </div>

        <div className="wmx-legal-section">
          <h2>7. Contact</h2>
          <div className="wmx-legal-contact">
            <p>Refund requests or questions about this policy: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
