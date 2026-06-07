import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../context/userContext'
import { faEye, faEyeSlash, faEnvelope, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginSocialButtons from './LoginSocialButtons.jsx';

const Login = () => {
  const [user, setuser] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const context = useContext(userContext)
  const { login, error } = context

  const handleClick = () => login(user.email, user.password)

  const onchange = (e) => setuser({ ...user, [e.target.name]: e.target.value })

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .wmx-login-page {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 60px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Background orbs */
        .wmx-login-page::before {
          content: '';
          position: absolute;
          top: -120px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(134,130,250,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .wmx-login-page::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -60px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(91,88,200,0.1) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Card */
        .wmx-login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
          background: #111118;
          border: 1px solid rgba(134,130,250,0.14);
          border-radius: 22px;
          padding: 40px 36px 36px;
          animation: wmx-login-in 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes wmx-login-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Dot grid */
        .wmx-login-card::before {
          content: '';
          position: absolute;
          inset: 0; border-radius: 22px;
          background-image: radial-gradient(rgba(134,130,250,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        /* Badge */
        .wmx-login-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 1.8px; text-transform: uppercase;
          color: #8682fa;
          background: rgba(134,130,250,0.1);
          border: 1px solid rgba(134,130,250,0.2);
          border-radius: 30px;
          padding: 4px 12px;
          margin-bottom: 18px;
        }
        .wmx-badge-dot {
          width: 5px; height: 5px;
          background: #8682fa; border-radius: 50%;
          animation: wmx-blink 2s ease-in-out infinite;
        }
        @keyframes wmx-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        /* Heading */
        .wmx-login-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.75rem;
          color: #f2f2ff; letter-spacing: -0.5px;
          margin: 0 0 6px;
        }
        .wmx-login-title span { color: #8682fa; }
        .wmx-login-sub {
          font-size: 0.82rem; color: #4a4a5a;
          margin: 0 0 26px; font-weight: 300;
        }

        /* Social divider */
        .wmx-social-wrap { margin-bottom: 20px; position: relative; z-index: 1; }
        .wmx-divider-row {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .wmx-divider-line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .wmx-divider-text {
          font-size: 0.72rem; color: #3a3a4a;
          letter-spacing: 1px; text-transform: uppercase;
          white-space: nowrap;
        }

        /* Field */
        .wmx-field { margin-bottom: 18px; position: relative; z-index: 1; }
        .wmx-label {
          display: block;
          font-size: 0.75rem; font-weight: 500;
          color: #6a6a80; letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .wmx-input-wrap {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .wmx-input-wrap:focus-within {
          border-color: rgba(134,130,250,0.45);
          box-shadow: 0 0 0 3px rgba(134,130,250,0.08);
        }
        .wmx-input-wrap.has-error {
          border-color: rgba(220,80,80,0.4);
        }
        .wmx-input-icon {
          padding: 0 12px;
          color: #3a3a4a; font-size: 0.75rem;
          flex-shrink: 0;
        }
        .wmx-input-wrap:focus-within .wmx-input-icon { color: #8682fa; }
        .wmx-input {
          flex: 1; padding: 12px 12px 12px 0;
          background: none; border: none; outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; color: #f2f2ff;
          width: 100%;
        }
        .wmx-input::placeholder { color: #2e2e3e; }
        .wmx-eye-btn {
          background: none; border: none;
          color: #3a3a4a; font-size: 0.78rem;
          padding: 0 14px; cursor: pointer;
          transition: color 0.2s; flex-shrink: 0;
        }
        .wmx-eye-btn:hover { color: #8682fa; }

        .wmx-error {
          font-size: 0.72rem; color: #e05555;
          margin: 6px 0 0 4px;
          min-height: 16px; display: block;
        }

        /* Submit */
        .wmx-submit {
          width: 100%; padding: 13px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.9rem;
          color: #fff;
          background: linear-gradient(135deg, #8682fa, #5f5bc7);
          border: none; border-radius: 11px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 22px rgba(134,130,250,0.32);
          transition: all 0.25s ease;
          margin-top: 6px;
          position: relative; z-index: 1;
        }
        .wmx-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(134,130,250,0.5);
        }
        .wmx-submit:active { transform: translateY(0); }

        /* Footer link */
        .wmx-login-footer {
          text-align: center;
          margin-top: 22px;
          font-size: 0.8rem; color: #3a3a4a;
          position: relative; z-index: 1;
        }
        .wmx-login-footer a {
          color: #8682fa; text-decoration: none;
          font-weight: 500; margin-left: 6px;
          transition: color 0.2s;
        }
        .wmx-login-footer a:hover { color: #b8b5ff; }

        @media (max-width: 480px) {
          .wmx-login-card { padding: 30px 22px 28px; }
        }
      `}</style>

      <div className="wmx-login-page">
        <div className="wmx-login-card">

          {/* Badge */}
          <div className="wmx-login-badge">
            <span className="wmx-badge-dot" />
            Welcome Back
          </div>

          {/* Title */}
          <h2 className="wmx-login-title">Login to <span>WebMarketX</span></h2>
          <p className="wmx-login-sub">Your digital marketplace awaits.</p>

          {/* Social */}
          <div className="wmx-social-wrap">
            <LoginSocialButtons />
          </div>

          <div className="wmx-divider-row">
            <div className="wmx-divider-line" />
            <span className="wmx-divider-text">or continue with email</span>
            <div className="wmx-divider-line" />
          </div>

          {/* Email */}
          <div className="wmx-field">
            <label className="wmx-label" htmlFor="email">Email Address</label>
            <div className={`wmx-input-wrap ${error?.email ? 'has-error' : ''}`}>
              <span className="wmx-input-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                className="wmx-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                onChange={onchange}
              />
            </div>
            {error?.email && <span className="wmx-error">{error.email}</span>}
          </div>

          {/* Password */}
          <div className="wmx-field">
            <label className="wmx-label" htmlFor="password">Password</label>
            <div className={`wmx-input-wrap ${error?.password ? 'has-error' : ''}`}>
              <span className="wmx-input-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                className="wmx-input"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                onChange={onchange}
              />
              <button
                type="button"
                className="wmx-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {error?.password && <span className="wmx-error">{error.password}</span>}
          </div>

          {/* Submit */}
          <button type="button" className="wmx-submit" onClick={handleClick}>
            Login
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
          </button>

          {/* Footer */}
          <div className="wmx-login-footer">
            Don't have an account?
            <Link to="/signup">Create Account</Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;