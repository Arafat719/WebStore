import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars, faXmark, faRightFromBracket, faUser, faSun, faMoon, faGear, faReceipt, faWandMagicSparkles, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import userContext from '../context/userContext';
import '../css/Navbar.css';

const Navbar = ({ setAlert }) => {
  const context = useContext(userContext);
  const { userId, firstLetter, profilePic, userType, userRoles, theme, toggleTheme, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, setUserVersion } = context;

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const [dropdownFocusIndex, setDropdownFocusIndex] = useState(-1);
  const [notifFocusIndex, setNotifFocusIndex] = useState(-1);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const orderMenuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    setUserVersion(v => v + 1);
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
        setDropdownFocusIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
        setNotifFocusIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close order dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (orderMenuRef.current && !orderMenuRef.current.contains(e.target)) {
        setOrderMenuOpen(false);
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

  useEffect(() => {
    const DROPDOWN_ITEMS = 5; // My Profile, My Orders, Smart Order, Settings, Logout
    const handleKey = (e) => {
      // Close dropdowns on Escape
      if (e.key === 'Escape') {
        if (mobileOpen) { setMobileOpen(false); return; }
        if (dropdownOpen) { setDropdownOpen(false); setDropdownFocusIndex(-1); return; }
        if (notifOpen) { setNotifOpen(false); setNotifFocusIndex(-1); return; }
        if (orderMenuOpen) { setOrderMenuOpen(false); return; }
      }
      // Avatar dropdown arrow key navigation
      if (dropdownOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setDropdownFocusIndex(i => (i + 1) % DROPDOWN_ITEMS);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setDropdownFocusIndex(i => (i - 1 + DROPDOWN_ITEMS) % DROPDOWN_ITEMS);
        }
        if (e.key === 'Enter' && dropdownFocusIndex >= 0) {
          e.preventDefault();
          const items = dropdownRef.current?.querySelectorAll('.wmx-dd-item');
          if (items?.[dropdownFocusIndex]) items[dropdownFocusIndex].click();
        }
      }
      // Notification dropdown arrow key navigation
      if (notifOpen) {
        const notifItems = notifRef.current?.querySelectorAll('.wmx-notif-item');
        const total = notifItems?.length || 0;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setNotifFocusIndex(i => total > 0 ? (i + 1) % total : -1);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setNotifFocusIndex(i => total > 0 ? (i - 1 + total) % total : -1);
        }
        if (e.key === 'Enter' && notifFocusIndex >= 0) {
          e.preventDefault();
          notifItems?.[notifFocusIndex]?.click();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen, dropdownOpen, notifOpen, orderMenuOpen, dropdownFocusIndex, notifFocusIndex]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/help", label: "Help" },
    { to: "/docs", label: "Docs" },
  ];

  return (
    <>

      {/* Navbar */}
      <div className={`wmx-nav ${show ? '' : 'hidden'} ${scrolled ? 'scrolled' : ''}`}>
        <div className="wmx-nav-inner">
          <div className="wmx-nav-container">

            {/* Logo */}
            <Link className="wmx-logo" to="/">
              <img className="wmx-logo-img wmx-logo-img-light" src="/wmx-logo-full.png" alt="WebMarketX" />
              <img className="wmx-logo-img wmx-logo-img-dark" src="/wmx-logo-full-dark.png" alt="WebMarketX" />
            </Link>

            {/* Desktop links */}
            <ul className="wmx-nav-links wmx-desktop-only">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    className={({ isActive }) => `wmx-nav-link${isActive ? ' active' : ''}`}
                    to={to}
                    end={to === "/"}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {token && (
                <li className="wmx-nav-order-wrap" ref={orderMenuRef}>
                  <button
                    className={`wmx-nav-link wmx-nav-order-btn${["/smart-order", "/myorders"].includes(location.pathname) ? " active" : ""}`}
                    onClick={() => setOrderMenuOpen(o => !o)}
                  >
                    Order
                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.6rem' }} />
                  </button>
                  {orderMenuOpen && (
                    <div className="wmx-dropdown wmx-nav-order-dropdown">
                      <Link className="wmx-dd-item" to="/smart-order" onClick={() => setOrderMenuOpen(false)}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        Smart Order
                      </Link>
                      <Link className="wmx-dd-item" to="/myorders" onClick={() => setOrderMenuOpen(false)}>
                        <FontAwesomeIcon icon={faReceipt} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        My Orders
                      </Link>
                    </div>
                  )}
                </li>
              )}
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
              {token && (
                <div className="wmx-notif-wrap" ref={notifRef}>
                  <button
                    className="wmx-notif-btn"
                    onClick={() => setNotifOpen(o => !o)}
                    aria-label="Notifications"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {unreadCount > 0 && (
                      <span className="wmx-notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="wmx-notif-dropdown">
                      <div className="wmx-notif-header">
                        <span className="wmx-notif-title">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            className="wmx-notif-mark-all"
                            onClick={markAllNotificationsRead}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="wmx-notif-list">
                        {notifications.length === 0 ? (
                          <div className="wmx-notif-empty">No notifications yet</div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n._id}
                              className={`wmx-notif-item ${!n.read ? "unread" : ""}`}
                              onClick={() => {
                                if (!n.read) markNotificationRead(n._id);
                              }}
                            >
                              <div className="wmx-notif-item-title">{n.title}</div>
                              <div className="wmx-notif-item-msg">{n.message}</div>
                              <div className="wmx-notif-item-time">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {token ? (
                <div className="wmx-avatar-wrap" ref={dropdownRef}>
                  <button className="wmx-avatar" onClick={() => setDropdownOpen(o => !o)}>
                    {profilePic
                      ? <img src={profilePic} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : firstLetter
                    }
                  </button>
                  {dropdownOpen && (
                    <div className="wmx-dropdown" onMouseMove={() => setDropdownFocusIndex(-1)}>
                      <Link className="wmx-dd-item" to={`/profile/${userId}`} onClick={() => setDropdownOpen(false)} data-dd-index="0" style={dropdownFocusIndex === 0 ? { background: 'rgba(134,130,250,0.12)', outline: 'none' } : {}}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        My Profile
                      </Link>
                      <Link className="wmx-dd-item" to="/myorders" onClick={() => setDropdownOpen(false)} data-dd-index="1" style={dropdownFocusIndex === 1 ? { background: 'rgba(134,130,250,0.12)', outline: 'none' } : {}}>
                        <FontAwesomeIcon icon={faReceipt} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        My Orders
                      </Link>
                      <Link className="wmx-dd-item" to="/smart-order" onClick={() => setDropdownOpen(false)} data-dd-index="2" style={dropdownFocusIndex === 2 ? { background: 'rgba(134,130,250,0.12)', outline: 'none' } : {}}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        Smart Order
                      </Link>
                      <Link className="wmx-dd-item" to="/settings" onClick={() => setDropdownOpen(false)} data-dd-index="3" style={dropdownFocusIndex === 3 ? { background: 'rgba(134,130,250,0.12)', outline: 'none' } : {}}>
                        <FontAwesomeIcon icon={faGear} style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
                        Settings
                      </Link>
                      <div className="wmx-dd-divider" />
                      <button className="wmx-dd-item danger" onClick={handleLogout} data-dd-index="4" style={dropdownFocusIndex === 4 ? { background: 'rgba(226,75,74,0.12)', outline: 'none' } : {}}>
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
            <NavLink
              key={to}
              className={({ isActive }) => `wmx-drawer-link${isActive ? ' active' : ''}`}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
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