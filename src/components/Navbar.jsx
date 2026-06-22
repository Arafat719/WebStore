import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import Logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars, faXmark, faRightFromBracket, faUser, faSun, faMoon, faGear, faReceipt, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import userContext from '../context/userContext';
import '../css/Navbar.css';

const Navbar = ({ setAlert }) => {
  const context = useContext(userContext);
  const { userId, firstLetter, profilePic, userType, userRoles, theme, toggleTheme } = context;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMobileOpen(false);
    navigate("/login");
  };

  // Smart hide/show + scrolled blur
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY - lastScrollY.current > 10) setShow(false);
      else if (lastScrollY.current - currentScrollY > 10) setShow(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/help", label: "Help" },
  ];

  return (
    <>

      {/* Navbar */}
      <div className={`wmx-nav ${show ? '' : 'hidden'} ${scrolled ? 'scrolled' : ''}`}>
        <div className="wmx-nav-inner">
          <div className="wmx-nav-container">

            {/* Logo */}
            <Link className="wmx-logo" to="/">
              <img src={Logo} />
              <span className="wmx-logo-text">Web<span>Market</span>X</span>
            </Link>

            {/* Desktop links */}
            <ul className="wmx-nav-links wmx-desktop-only">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link className="wmx-nav-link" to={to}>{label}</Link>
                </li>
              ))}
              {userRoles?.includes("seller") && (
                <li>
                  <Link className="wmx-nav-link add-btn" to="/addproducts">
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />
                    Add Website
                  </Link>
                </li>
              )}
            </ul>

            {/* Desktop auth */}
            <div className="wmx-auth wmx-desktop-only">
              <button className="wmx-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
              </button>
              {token ? (
                <div className="wmx-avatar-wrap" ref={dropdownRef}>
                  <button className="wmx-avatar" onClick={() => setDropdownOpen(o => !o)}>
                    {profilePic
                      ? <img src={profilePic} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : firstLetter
                    }
                  </button>
                  {dropdownOpen && (
                    <div className="wmx-dropdown">
                      <Link className="wmx-dd-item" to={`/profile/${userId}`} onClick={() => setDropdownOpen(false)}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        My Profile
                      </Link>
                      <Link className="wmx-dd-item" to="/myorders" onClick={() => setDropdownOpen(false)}>
                        <FontAwesomeIcon icon={faReceipt} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        My Orders
                      </Link>
                      <Link className="wmx-dd-item" to="/smart-order" onClick={() => setDropdownOpen(false)}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        Smart Order
                      </Link>
                      <Link className="wmx-dd-item" to="/settings" onClick={() => setDropdownOpen(false)}>
                        <FontAwesomeIcon icon={faGear} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        Settings
                      </Link>
                      <div className="wmx-dd-divider" />
                      <button className="wmx-dd-item danger" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: '0.75rem' }} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link className="wmx-auth-btn wmx-btn-login" to="/login">Login</Link>
                  <Link className="wmx-auth-btn wmx-btn-signup" to="/signup">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button className="wmx-mobile-toggle" onClick={() => setMobileOpen(true)}>
              <FontAwesomeIcon icon={faBars} />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`wmx-drawer-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`wmx-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="wmx-drawer-head">
          <span className="wmx-drawer-title">Menu</span>
          <button className="wmx-drawer-close" onClick={() => setMobileOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="wmx-drawer-body">
          {navLinks.map(({ to, label }) => (
            <Link key={to} className="wmx-drawer-link" to={to} onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          {userRoles?.includes("seller") && (
            <Link className="wmx-drawer-link purple" to="/addproducts" onClick={() => setMobileOpen(false)}>
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.75rem' }} />
              Add Website
            </Link>
          )}
        </div>

        <div className="wmx-drawer-footer">
          <button className="wmx-theme-toggle wmx-drawer-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          {token ? (
            <>
              <Link
                className="wmx-drawer-auth-btn ghost"
                to={`/profile/${userId}`}
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </Link>
              <Link
                className="wmx-drawer-auth-btn ghost"
                to="/myorders"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
              <Link
                className="wmx-drawer-auth-btn ghost"
                to="/smart-order"
                onClick={() => setMobileOpen(false)}
              >
                Smart Order
              </Link>
              <Link
                className="wmx-drawer-auth-btn ghost"
                to="/settings"
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </Link>
              <button className="wmx-drawer-auth-btn danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="wmx-drawer-auth-btn ghost" to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link className="wmx-drawer-auth-btn filled" to="/signup" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;