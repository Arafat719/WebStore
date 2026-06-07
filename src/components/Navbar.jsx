import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import Logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars, faXmark, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import userContext from '../context/userContext';

const Navbar = () => {
  const context = useContext(userContext);
  const { userId, firstLetter } = context;

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
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .wmx-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .wmx-nav.hidden { transform: translateY(-100%); }

        .wmx-nav-inner {
          background: rgba(10, 10, 18, 0.6);
          border-bottom: 1px solid rgba(134,130,250,0.0);
          backdrop-filter: blur(0px);
          transition: all 0.35s ease;
        }
        .wmx-nav.scrolled .wmx-nav-inner {
          background: rgba(10, 10, 18, 0.85);
          border-bottom-color: rgba(134,130,250,0.12);
          backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }

        .wmx-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* Logo */
        .wmx-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .wmx-logo img { height: 32px; width: auto; }
        .wmx-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: #f2f2ff;
          letter-spacing: -0.5px;
        }
        .wmx-logo-text span { color: #8682fa; }

        /* Desktop nav links */
        .wmx-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }

        .wmx-nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 0.875rem;
          font-weight: 400;
          color: #7a7a90;
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .wmx-nav-link:hover {
          color: #f2f2ff;
          background: rgba(255,255,255,0.05);
        }
        .wmx-nav-link.add-btn {
          color: #8682fa;
          background: rgba(134,130,250,0.08);
          border: 1px solid rgba(134,130,250,0.2);
        }
        .wmx-nav-link.add-btn:hover {
          background: rgba(134,130,250,0.16);
          color: #b8b5ff;
          border-color: rgba(134,130,250,0.38);
        }

        /* Auth area */
        .wmx-auth {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .wmx-auth-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          border-radius: 9px;
          padding: 7px 16px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.22s ease;
          border: none;
        }
        .wmx-btn-login {
          color: #8682fa;
          background: rgba(134,130,250,0.1);
          border: 1px solid rgba(134,130,250,0.22);
        }
        .wmx-btn-login:hover {
          background: rgba(134,130,250,0.18);
          color: #b8b5ff;
        }
        .wmx-btn-signup {
          color: #fff;
          background: linear-gradient(135deg, #8682fa, #5f5bc7);
          box-shadow: 0 4px 16px rgba(134,130,250,0.3);
        }
        .wmx-btn-signup:hover {
          box-shadow: 0 6px 22px rgba(134,130,250,0.5);
          transform: translateY(-1px);
          color: #fff;
        }

        /* Avatar dropdown */
        .wmx-avatar-wrap { position: relative; }
        .wmx-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8682fa, #5f5bc7);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 14px rgba(134,130,250,0.35);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .wmx-avatar:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(134,130,250,0.5);
        }

        .wmx-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 170px;
          background: #14141e;
          border: 1px solid rgba(134,130,250,0.15);
          border-radius: 12px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: wmx-dd-in 0.18s ease;
          z-index: 100;
        }
        @keyframes wmx-dd-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .wmx-dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 16px;
          font-size: 0.83rem;
          color: #8888a0;
          text-decoration: none;
          cursor: pointer;
          background: none; border: none; width: 100%;
          text-align: left;
          transition: color 0.18s, background 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .wmx-dd-item:hover { color: #f2f2ff; background: rgba(255,255,255,0.04); }
        .wmx-dd-item.danger:hover { color: #ff6b6b; background: rgba(255,107,107,0.06); }
        .wmx-dd-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 4px 0; }

        /* Mobile toggle */
        .wmx-mobile-toggle {
          display: none;
          background: none; border: none;
          color: #7a7a90;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .wmx-mobile-toggle:hover { color: #f2f2ff; background: rgba(255,255,255,0.06); }

        /* Mobile drawer */
        .wmx-drawer-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 998;
          backdrop-filter: blur(4px);
          animation: wmx-fade-in 0.2s ease;
        }
        @keyframes wmx-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .wmx-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(300px, 85vw);
          background: #0e0e18;
          border-left: 1px solid rgba(134,130,250,0.12);
          z-index: 999;
          display: flex; flex-direction: column;
          padding: 0;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        .wmx-drawer.open { transform: translateX(0); }

        .wmx-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .wmx-drawer-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: #f2f2ff;
          letter-spacing: 0.5px;
        }
        .wmx-drawer-close {
          background: none; border: none;
          color: #5a5a6a;
          font-size: 1rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .wmx-drawer-close:hover { color: #f2f2ff; }

        .wmx-drawer-body {
          flex: 1; overflow-y: auto;
          padding: 16px 12px;
          display: flex; flex-direction: column; gap: 4px;
        }

        .wmx-drawer-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px;
          font-size: 0.9rem;
          color: #7a7a90;
          text-decoration: none;
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .wmx-drawer-link:hover { color: #f2f2ff; background: rgba(255,255,255,0.04); }
        .wmx-drawer-link.purple { color: #8682fa; background: rgba(134,130,250,0.07); }
        .wmx-drawer-link.purple:hover { background: rgba(134,130,250,0.14); color: #b8b5ff; }

        .wmx-drawer-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column; gap: 8px;
        }
        .wmx-drawer-auth-btn {
          width: 100%;
          padding: 11px 16px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: all 0.2s;
        }
        .wmx-drawer-auth-btn.ghost {
          color: #8682fa;
          background: rgba(134,130,250,0.1);
          border: 1px solid rgba(134,130,250,0.2);
        }
        .wmx-drawer-auth-btn.ghost:hover { background: rgba(134,130,250,0.18); }
        .wmx-drawer-auth-btn.filled {
          color: #fff;
          background: linear-gradient(135deg, #8682fa, #5f5bc7);
        }
        .wmx-drawer-auth-btn.danger {
          color: #ff6b6b;
          background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.15);
        }

        @media (max-width: 768px) {
          .wmx-desktop-only { display: none !important; }
          .wmx-mobile-toggle { display: flex; }
          .wmx-drawer-overlay.open { display: block; }
        }
      `}</style>

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
              <li>
                <Link className="wmx-nav-link add-btn" to="/addproducts">
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />
                  Add Website
                </Link>
              </li>
            </ul>

            {/* Desktop auth */}
            <div className="wmx-auth wmx-desktop-only">
              {token ? (
                <div className="wmx-avatar-wrap" ref={dropdownRef}>
                  <button className="wmx-avatar" onClick={() => setDropdownOpen(o => !o)}>
                    {firstLetter?.[0]}
                  </button>
                  {dropdownOpen && (
                    <div className="wmx-dropdown">
                      <Link className="wmx-dd-item" to={`/profile/${userId}`} onClick={() => setDropdownOpen(false)}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.75rem', color: '#8682fa' }} />
                        View Profile
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
          <Link className="wmx-drawer-link purple" to="/addproducts" onClick={() => setMobileOpen(false)}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.75rem' }} />
            Add Website
          </Link>
        </div>

        <div className="wmx-drawer-footer">
          {token ? (
            <>
              <Link
                className="wmx-drawer-auth-btn ghost"
                to={`/profile/${userId}`}
                onClick={() => setMobileOpen(false)}
              >
                View Profile
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