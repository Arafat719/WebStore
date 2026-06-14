import { useContext, useState, useEffect } from 'react';
import userContext from '../context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import LoginSocialButtons from './LoginSocialButtons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faEyeSlash,
    faEnvelope,
    faLock,
    faUser,
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";

import '../css/signup.css';

const Signup = () => {
    const context = useContext(userContext);
    const { signUP, error } = context;

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");

    const [user, setuser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleClick = async () =>
        signUP(user.name, user.email, user.password, role);

    const onchange = (e) =>
        setuser({
            ...user,
            [e.target.name]: e.target.value
        });

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/");
        }
    }, []);

    return (
        <div className="wmx-signup-page">
            <div className="wmx-signup-card">

                <div className="wmx-su-badge">
                    <span className="wmx-su-dot"></span>
                    Join WebMarketX
                </div>

                <h2 className="wmx-su-title">
                    Create your <span>Account</span>
                </h2>

                <p className="wmx-su-sub">
                    Start buying & selling websites today.
                </p>

                <div className="wmx-su-toggle">
                    <button
                        type="button"
                        className={`wmx-su-toggle-btn ${role === "user" ? "active" : ""}`}
                        onClick={() => setRole("user")}
                    >
                        Buyer
                    </button>
                    <button
                        type="button"
                        className={`wmx-su-toggle-btn ${role === "seller" ? "active" : ""}`}
                        onClick={() => setRole("seller")}
                    >
                        Seller
                    </button>
                </div>

                <div className="wmx-su-social">
                    <LoginSocialButtons />
                </div>

                <div className="wmx-su-divider">
                    <div className="wmx-su-div-line"></div>

                    <span className="wmx-su-div-text">
                        or sign up with email
                    </span>

                    <div className="wmx-su-div-line"></div>
                </div>

                {/* Name */}

                <div className="wmx-su-field">
                    <label
                        className="wmx-su-label"
                        htmlFor="name"
                    >
                        User Name
                    </label>

                    <div className="wmx-su-input-wrap">
                        <span className="wmx-su-icon">
                            <FontAwesomeIcon icon={faUser} />
                        </span>

                        <input
                            className="wmx-su-input"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            onChange={onchange}
                        />
                    </div>
                </div>

                {/* Email */}

                <div className="wmx-su-field">
                    <label
                        className="wmx-su-label"
                        htmlFor="email"
                    >
                        Email Address
                    </label>

                    <div
                        className={`wmx-su-input-wrap ${
                            error?.email ? 'has-error' : ''
                        }`}
                    >
                        <span className="wmx-su-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>

                        <input
                            className="wmx-su-input"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            onChange={onchange}
                        />
                    </div>

                    {error?.email && (
                        <span className="wmx-su-error">
                            {error.email}
                        </span>
                    )}
                </div>

                {/* Password */}

                <div className="wmx-su-field">
                    <label
                        className="wmx-su-label"
                        htmlFor="password"
                    >
                        Password
                    </label>

                    <div
                        className={`wmx-su-input-wrap ${
                            error?.password ? 'has-error' : ''
                        }`}
                    >
                        <span className="wmx-su-icon">
                            <FontAwesomeIcon icon={faLock} />
                        </span>

                        <input
                            className="wmx-su-input"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            id="password"
                            name="password"
                            placeholder="Min. 8 characters"
                            onChange={onchange}
                        />

                        <button
                            type="button"
                            className="wmx-su-eye"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            <FontAwesomeIcon
                                icon={
                                    showPassword
                                        ? faEyeSlash
                                        : faEye
                                }
                            />
                        </button>
                    </div>

                    {user.password && (
                        <div className="wmx-strength-bar">
                            <div
                                className={`wmx-strength-seg ${
                                    user.password.length >= 1
                                        ? user.password.length < 5
                                            ? 'weak'
                                            : user.password.length < 8
                                            ? 'medium'
                                            : 'strong'
                                        : ''
                                }`}
                            />

                            <div
                                className={`wmx-strength-seg ${
                                    user.password.length >= 5
                                        ? user.password.length < 8
                                            ? 'medium'
                                            : 'strong'
                                        : ''
                                }`}
                            />

                            <div
                                className={`wmx-strength-seg ${
                                    user.password.length >= 8
                                        ? 'strong'
                                        : ''
                                }`}
                            />
                        </div>
                    )}

                    {error?.password && (
                        <span className="wmx-su-error">
                            {error.password}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="wmx-su-submit"
                    onClick={handleClick}
                >
                    Create Account

                    <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{
                            fontSize: '0.8rem'
                        }}
                    />
                </button>

                <div className="wmx-terms">
                    By signing up you agree to our{' '}
                    <a href="#">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#">Privacy Policy</a>.
                </div>

                <div className="wmx-su-footer">
                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Signup;