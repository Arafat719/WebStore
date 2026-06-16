import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="wmx-payment-result">
      <div className="wmx-payment-icon wmx-fail-icon">✕</div>
      <h2>Payment Failed</h2>
      <p>Something went wrong. Please try again.</p>
      <button className="wmx-btn-primary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}
