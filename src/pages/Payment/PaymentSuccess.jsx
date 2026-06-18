import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Payment.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/myorders"), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="wmx-payment-result">
      <div className="wmx-payment-icon wmx-success-icon">✓</div>
      <h2 className="wmx-payment-title">Payment Successful!</h2>
      <p className="wmx-payment-sub">Your purchase is confirmed. Redirecting to My Orders...</p>
      <div className="wmx-payment-delivery">
        <p className="wmx-payment-delivery-text">
          Your product has been delivered. Go to My Orders to download it.
        </p>
        <Link to="/myorders" className="wmx-payment-orders-btn">
          Go to My Orders
        </Link>
      </div>
    </div>
  );
}
