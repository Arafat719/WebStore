import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock, faEnvelope, faArrowLeft,
  faCheckCircle, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import '../css/Login.css';
import '../css/ForgotPassword.css';

const API = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wmx-login-page">
      <div className="wmx-login-card">

        <button className="wmx-fp-back" onClick={() => navigate('/login')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Login
        </button>

        {sent ? (
          <div className="wmx-fp-success">
            <div className="wmx-fp-success-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h3 className="wmx-fp-success-title">Email sent! Check your inbox.</h3>
            <p className="wmx-fp-success-sub">
              If an account exists for this email, you'll receive a reset link within a few minutes.
            </p>
            <Link to="/login" className="wmx-submit wmx-fp-back-btn">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="wmx-fp-icon-wrap">
              <FontAwesomeIcon icon={faLock} className="wmx-fp-icon" />
            </div>

            <h2 className="wmx-login-title">Forgot Password</h2>
            <p className="wmx-login-sub">
              Enter your email and we'll send you a reset link.
            </p>

            <div className="wmx-field">
              <label className="wmx-label" htmlFor="fp-email">Email Address</label>
              <div className="wmx-input-wrap">
                <span className="wmx-input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  className="wmx-input"
                  type="email"
                  id="fp-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            {error && <p className="wmx-fp-error">{error}</p>}

            <button
              type="button"
              className="wmx-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : 'Send Reset Link'
              }
            </button>

            <div className="wmx-login-footer">
              Remembered your password?
              <Link to="/login">Back to Login</Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
