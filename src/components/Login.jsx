import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../context/userContext'
import { faEye, faEyeSlash, faEnvelope, faLock, faArrowRight, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginSocialButtons from './LoginSocialButtons.jsx';
import '../css/Login.css';

const Login = () => {
  const [user, setuser] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const context = useContext(userContext)
  const { login, error, verifyTwoFactorLogin } = context

  const [tempToken, setTempToken]     = useState(null);
  const [twoFACode, setTwoFACode]     = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [twoFAError, setTwoFAError]   = useState('');
  const [verifying, setVerifying]     = useState(false);

  const handleClick = async () => {
    const result = await login(user.email, user.password)
    if (result?.requiresTwoFactor) setTempToken(result.tempToken);
  }

  const handleVerify2FA = async () => {
    if (!twoFACode) return;
    setVerifying(true);
    setTwoFAError('');
    const result = await verifyTwoFactorLogin(
      tempToken,
      useBackupCode ? undefined : twoFACode,
      useBackupCode ? twoFACode : undefined
    );
    setVerifying(false);
    if (!result.success) setTwoFAError(result.error);
  }

  const onchange = (e) => setuser({ ...user, [e.target.name]: e.target.value })

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, []);

  if (tempToken) {
    return (
      <div className="wmx-login-page">
        <div className="wmx-login-card">
          <div className="wmx-login-badge">
            <span className="wmx-badge-dot" />
            Two-Factor Authentication
          </div>

          <h2 className="wmx-login-title">Verify it's <span>you</span></h2>
          <p className="wmx-login-sub">
            {useBackupCode
              ? 'Enter one of your unused backup codes.'
              : 'Enter the 6-digit code from your authenticator app.'}
          </p>

          <div className="wmx-field">
            <label className="wmx-label" htmlFor="twofa">
              {useBackupCode ? 'Backup Code' : 'Authentication Code'}
            </label>
            <div className={`wmx-input-wrap ${twoFAError ? 'has-error' : ''}`}>
              <span className="wmx-input-icon">
                <FontAwesomeIcon icon={faShieldHalved} />
              </span>
              <input
                className="wmx-input"
                type="text"
                id="twofa"
                placeholder={useBackupCode ? '••••••••' : '••••••'}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.trim())}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify2FA()}
                autoFocus
              />
            </div>
            {twoFAError && <span className="wmx-error">{twoFAError}</span>}
          </div>

          <button type="button" className="wmx-submit" onClick={handleVerify2FA} disabled={verifying}>
            {verifying ? 'Verifying…' : 'Verify & Continue'}
            {!verifying && <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />}
          </button>

          <div className="wmx-login-footer">
            <button
              type="button"
              className="wmx-forgot-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => { setUseBackupCode(v => !v); setTwoFACode(''); setTwoFAError(''); }}
            >
              {useBackupCode ? 'Use authenticator code instead' : "Can't access your authenticator? Use a backup code"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>

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
            <LoginSocialButtons onRequiresTwoFactor={setTempToken} />
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
            <div className="wmx-forgot-row">
              <Link to="/forgot-password" className="wmx-forgot-link">Forgot Password?</Link>
            </div>
          </div>

          {/* Submit */}
          <button type="button" className="wmx-submit" onClick={handleClick}>
            Login
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
          </button>

          {(error?.blocked || error?.unknown) && (
            <div className="wmx-blocked-error">
              <span className="wmx-blocked-icon">⊘</span>
              <span>{error.blocked || error.unknown}</span>
            </div>
          )}

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