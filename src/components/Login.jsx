import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../context/userContext'
import { faEye, faEyeSlash, faEnvelope, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginSocialButtons from './LoginSocialButtons.jsx';
import '../css/Login.css';

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