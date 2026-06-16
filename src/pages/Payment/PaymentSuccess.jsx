import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/myorders"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="wmx-payment-result">
      <div className="wmx-payment-icon wmx-success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <p>Your purchase is confirmed. Redirecting to My Orders...</p>
    </div>
  );
}
