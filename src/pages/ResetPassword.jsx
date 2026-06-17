import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock, faEye, faEyeSlash,
  faCheckCircle, faSpinner, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import '../css/Login.css';
import '../css/ResetPassword.css';

const API = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!success) return;
    if (countdown === 0) { navigate('/login'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, navigate]);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Invalid or expired link. Please request a new one.');
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

        {success ? (
          <div className="wmx-rp-success">
            <div className="wmx-rp-success-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h3 className="wmx-rp-success-title">Password reset successful!</h3>
            <p className="wmx-rp-countdown">
              Redirecting to login in {countdown}...
            </p>
            <Link to="/login" className="wmx-submit wmx-rp-go-btn">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="wmx-rp-icon-wrap">
              <FontAwesomeIcon icon={faLock} className="wmx-rp-icon" />
            </div>

            <h2 className="wmx-login-title">Reset Password</h2>
            <p className="wmx-login-sub">Enter your new password below.</p>

            {/* New Password */}
            <div className="wmx-field">
              <label className="wmx-label" htmlFor="rp-pw">New Password</label>
              <div className="wmx-input-wrap">
                <span className="wmx-input-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  className="wmx-input"
                  type={showPw ? 'text' : 'password'}
                  id="rp-pw"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  className="wmx-eye-btn"
                  onClick={() => setShowPw(v => !v)}
                >
                  <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} />
                </button>
              </div>
              {password && (
                <div className="wmx-rp-strength-bar">
                  <div className={`wmx-rp-strength-seg ${
                    password.length >= 1
                      ? password.length < 5 ? 'weak' : password.length < 8 ? 'medium' : 'strong'
                      : ''
                  }`} />
                  <div className={`wmx-rp-strength-seg ${
                    password.length >= 5
                      ? password.length < 8 ? 'medium' : 'strong'
                      : ''
                  }`} />
                  <div className={`wmx-rp-strength-seg ${
                    password.length >= 8 ? 'strong' : ''
                  }`} />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="wmx-field">
              <label className="wmx-label" htmlFor="rp-confirm">Confirm Password</label>
              <div className="wmx-input-wrap">
                <span className="wmx-input-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  className="wmx-input"
                  type={showConfirm ? 'text' : 'password'}
                  id="rp-confirm"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  className="wmx-eye-btn"
                  onClick={() => setShowConfirm(v => !v)}
                >
                  <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {error && (
              <div className="wmx-rp-error">
                <FontAwesomeIcon icon={faExclamationTriangle} className="wmx-rp-error-icon" />
                <span>{error}</span>
                {error.includes('Invalid or expired') && (
                  <Link to="/forgot-password" className="wmx-rp-try-again">Try Again</Link>
                )}
              </div>
            )}

            <button
              type="button"
              className="wmx-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : 'Reset Password'
              }
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
