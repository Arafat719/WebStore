import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
import { Link, useNavigate } from 'react-router-dom';
import LoginSocialButtons from './LoginSocialButtons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock, faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
    const context = useContext(userContext)
    const { signUP, error } = context;
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [user, setuser] = useState({ name: '', email: '', password: '' })

    const handleClick = async () => signUP(user.name, user.email, user.password)
    const onchange = (e) => setuser({ ...user, [e.target.name]: e.target.value })

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/");
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .wmx-signup-page {
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

                .wmx-signup-page::before {
                    content: '';
                    position: absolute;
                    top: -80px; right: -100px;
                    width: 480px; height: 480px;
                    background: radial-gradient(circle, rgba(134,130,250,0.11) 0%, transparent 65%);
                    pointer-events: none;
                }
                .wmx-signup-page::after {
                    content: '';
                    position: absolute;
                    bottom: -100px; left: -60px;
                    width: 340px; height: 340px;
                    background: radial-gradient(circle, rgba(91,88,200,0.09) 0%, transparent 65%);
                    pointer-events: none;
                }

                .wmx-signup-card {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    max-width: 440px;
                    background: #111118;
                    border: 1px solid rgba(134,130,250,0.14);
                    border-radius: 22px;
                    padding: 40px 36px 36px;
                    animation: wmx-su-in 0.4s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes wmx-su-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .wmx-signup-card::before {
                    content: '';
                    position: absolute;
                    inset: 0; border-radius: 22px;
                    background-image: radial-gradient(rgba(134,130,250,0.055) 1px, transparent 1px);
                    background-size: 24px 24px;
                    pointer-events: none;
                }

                .wmx-su-badge {
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
                .wmx-su-dot {
                    width: 5px; height: 5px;
                    background: #8682fa; border-radius: 50%;
                    animation: wmx-su-blink 2s ease-in-out infinite;
                }
                @keyframes wmx-su-blink {
                    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
                }

                .wmx-su-title {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800; font-size: 1.75rem;
                    color: #f2f2ff; letter-spacing: -0.5px;
                    margin: 0 0 6px;
                }
                .wmx-su-title span { color: #8682fa; }
                .wmx-su-sub {
                    font-size: 0.82rem; color: #4a4a5a;
                    margin: 0 0 26px; font-weight: 300;
                }

                .wmx-su-social { margin-bottom: 20px; position: relative; z-index: 1; }

                .wmx-su-divider {
                    display: flex; align-items: center; gap: 12px;
                    margin: 20px 0;
                }
                .wmx-su-div-line {
                    flex: 1; height: 1px;
                    background: rgba(255,255,255,0.06);
                }
                .wmx-su-div-text {
                    font-size: 0.72rem; color: #3a3a4a;
                    letter-spacing: 1px; text-transform: uppercase;
                    white-space: nowrap;
                }

                .wmx-su-field { margin-bottom: 16px; position: relative; z-index: 1; }
                .wmx-su-label {
                    display: block;
                    font-size: 0.75rem; font-weight: 500;
                    color: #6a6a80; letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                .wmx-su-input-wrap {
                    display: flex; align-items: center;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 11px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    overflow: hidden;
                }
                .wmx-su-input-wrap:focus-within {
                    border-color: rgba(134,130,250,0.45);
                    box-shadow: 0 0 0 3px rgba(134,130,250,0.08);
                }
                .wmx-su-input-wrap.has-error { border-color: rgba(220,80,80,0.4); }
                .wmx-su-icon {
                    padding: 0 12px;
                    color: #3a3a4a; font-size: 0.75rem; flex-shrink: 0;
                }
                .wmx-su-input-wrap:focus-within .wmx-su-icon { color: #8682fa; }
                .wmx-su-input {
                    flex: 1; padding: 12px 12px 12px 0;
                    background: none; border: none; outline: none;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem; color: #f2f2ff; width: 100%;
                }
                .wmx-su-input::placeholder { color: #2e2e3e; }
                .wmx-su-eye {
                    background: none; border: none;
                    color: #3a3a4a; font-size: 0.78rem;
                    padding: 0 14px; cursor: pointer;
                    transition: color 0.2s; flex-shrink: 0;
                }
                .wmx-su-eye:hover { color: #8682fa; }
                .wmx-su-error {
                    font-size: 0.72rem; color: #e05555;
                    margin: 6px 0 0 4px;
                    min-height: 16px; display: block;
                }

                /* Password strength */
                .wmx-strength-bar {
                    display: flex; gap: 4px; margin-top: 8px;
                }
                .wmx-strength-seg {
                    flex: 1; height: 3px; border-radius: 2px;
                    background: rgba(255,255,255,0.06);
                    transition: background 0.3s;
                }
                .wmx-strength-seg.weak   { background: #e05555; }
                .wmx-strength-seg.medium { background: #f5a623; }
                .wmx-strength-seg.strong { background: #4caf82; }

                .wmx-su-submit {
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
                    margin-top: 8px;
                    position: relative; z-index: 1;
                }
                .wmx-su-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 32px rgba(134,130,250,0.5);
                }
                .wmx-su-submit:active { transform: translateY(0); }

                .wmx-su-footer {
                    text-align: center;
                    margin-top: 22px;
                    font-size: 0.8rem; color: #3a3a4a;
                    position: relative; z-index: 1;
                }
                .wmx-su-footer a {
                    color: #8682fa; text-decoration: none;
                    font-weight: 500; margin-left: 6px;
                    transition: color 0.2s;
                }
                .wmx-su-footer a:hover { color: #b8b5ff; }

                .wmx-terms {
                    font-size: 0.7rem; color: #3a3a4a;
                    text-align: center; margin-top: 14px;
                    line-height: 1.6;
                    position: relative; z-index: 1;
                }
                .wmx-terms a { color: #6a6a90; text-decoration: underline; }

                @media (max-width: 480px) {
                    .wmx-signup-card { padding: 28px 20px 26px; }
                }
            `}</style>

            <div className="wmx-signup-page">
                <div className="wmx-signup-card">

                    <div className="wmx-su-badge">
                        <span className="wmx-su-dot" />
                        Join WebMarketX
                    </div>

                    <h2 className="wmx-su-title">Create your <span>Account</span></h2>
                    <p className="wmx-su-sub">Start buying & selling websites today.</p>

                    <div className="wmx-su-social">
                        <LoginSocialButtons />
                    </div>

                    <div className="wmx-su-divider">
                        <div className="wmx-su-div-line" />
                        <span className="wmx-su-div-text">or sign up with email</span>
                        <div className="wmx-su-div-line" />
                    </div>

                    {/* Name */}
                    <div className="wmx-su-field">
                        <label className="wmx-su-label" htmlFor="name">User Name</label>
                        <div className="wmx-su-input-wrap">
                            <span className="wmx-su-icon"><FontAwesomeIcon icon={faUser} /></span>
                            <input
                                className="wmx-su-input"
                                type="text" id="name" name="name"
                                placeholder="John Doe"
                                onChange={onchange}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="wmx-su-field">
                        <label className="wmx-su-label" htmlFor="email">Email Address</label>
                        <div className={`wmx-su-input-wrap ${error?.email ? 'has-error' : ''}`}>
                            <span className="wmx-su-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                            <input
                                className="wmx-su-input"
                                type="email" id="email" name="email"
                                placeholder="you@example.com"
                                onChange={onchange}
                            />
                        </div>
                        {error?.email && <span className="wmx-su-error">{error.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="wmx-su-field">
                        <label className="wmx-su-label" htmlFor="password">Password</label>
                        <div className={`wmx-su-input-wrap ${error?.password ? 'has-error' : ''}`}>
                            <span className="wmx-su-icon"><FontAwesomeIcon icon={faLock} /></span>
                            <input
                                className="wmx-su-input"
                                type={showPassword ? "text" : "password"}
                                id="password" name="password"
                                placeholder="Min. 8 characters"
                                onChange={onchange}
                            />
                            <button type="button" className="wmx-su-eye" onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {/* Password strength bar */}
                        {user.password && (
                            <div className="wmx-strength-bar">
                                <div className={`wmx-strength-seg ${user.password.length >= 1 ? (user.password.length < 5 ? 'weak' : user.password.length < 8 ? 'medium' : 'strong') : ''}`} />
                                <div className={`wmx-strength-seg ${user.password.length >= 5 ? (user.password.length < 8 ? 'medium' : 'strong') : ''}`} />
                                <div className={`wmx-strength-seg ${user.password.length >= 8 ? 'strong' : ''}`} />
                            </div>
                        )}
                        {error?.password && <span className="wmx-su-error">{error.password}</span>}
                    </div>

                    <button type="button" className="wmx-su-submit" onClick={handleClick}>
                        Create Account
                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                    </button>

                    <div className="wmx-terms">
                        By signing up you agree to our{' '}
                        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </div>

                    <div className="wmx-su-footer">
                        Already have an account?
                        <Link to="/login">Login</Link>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Signup;