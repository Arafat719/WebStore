import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import '../Navbar.css';
import Logo from "../assets/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import userContext from '../context/userContext'


const Navbar = () => {
  const context = useContext(userContext);
  const {userId, firstLetter } = context

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //Smart navbar
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0); // useRef ব্যবহার করলে state lag হবে না

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY - lastScrollY.current > 10) {
        // scroll down
        setShow(false);
      } else if (lastScrollY.current - currentScrollY > 10) {
        // scroll up
        setShow(true);
      }

      lastScrollY.current = currentScrollY;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  return (
    <div>
      <nav
        className={`navbar navbar-dark navbar-expand-md shadow fixed-top ${show ? "navbar-show" : "navbar-hide"}`}
      >
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img
              src={Logo}
              alt="Logo"
              // width="55"
              height="35"
              className="d-inline-block align-top me-2"
            />
          </Link>
          {/* <h5 className='' style={{ color: "#8682fa" }}>WebmarketX</h5> */}

          {/* Mobile Menu Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
            aria-controls="sidebar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Navbar Items */}
          <div className="collapse navbar-collapse d-none d-lg-flex" >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link mx-2 active"
                  style={{ color: "#3b379c" }}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link mx-2 active"
                  style={{ color: "#3b379c" }}
                  aria-current="page"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link mx-2"
                  style={{ color: "#3b379c" }}
                  to="/addproducts"
                >
                  <FontAwesomeIcon icon={faPlus} className='mx-1' />
                  Add Website
                </Link>
              </li>
            </ul>

            {/* Desktop Auth Buttons */}
            <form className="d-flex ms-3">
              {token ? (
                <div className="dropdown">
                  <button type="button"
                    className="btn rounded-circle fw-bold"
                    style={{ backgroundColor: "#8682fa" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    {firstLetter[0]}
                  </button>
                  <div className="dropdown-menu dropdown-menu-end shadow border-0">
                    <Link className="dropdown-item" to={`/profile/${userId}`} >View Profile</Link>
                    <Link className="dropdown-item" >Something else here</Link>
                    <Link className="dropdown-item" onClick={handleLogout} >Logout</Link>
                  </div>
                </div>

              ) : (
                <>
                  <Link
                    className="btn mx-1"
                    to="/login"
                    style={{ backgroundColor: "#8682fa" }}
                  >
                    Login
                  </Link>
                  <Link
                    className="btn mx-1"
                    to="/signup"
                    style={{ backgroundColor: "#8682fa" }}
                  >
                    Signup
                  </Link>
                </>
              )}
            </form>
          </div>

          {/* Mobile Sidebar */}
          <div
            className="offcanvas offcanvas-end d-lg-none"
            tabIndex="-1"
            id="sidebar"
          >
            <div className="offcanvas-header">
              <h5>Menu</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    className="nav-link mx-2 active"
                    style={{ color: "#8682fa" }}
                    aria-current="page"
                    to="/"
                    data-bs-dismiss="offcanvas"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link mx-2 active"
                    style={{ color: "#8682fa" }}
                    aria-current="page"
                    to="/about"
                    data-bs-dismiss="offcanvas"
                  >
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link mx-2"
                    style={{ color: "#8682fa" }}
                    to="/addproducts"
                    data-bs-dismiss="offcanvas"
                  >
                    Add Website
                  </Link>
                </li>
              </ul>

              {/* Mobile Auth Buttons */}
              <form className="d-flex mt-3">
                {token ? (
                  <button
                    type="button"
                    className="btn mx-1"
                    style={{ backgroundColor: "#8682fa" }}
                    onClick={() => {
                      handleLogout();
                      document.getElementById("sidebar").classList.remove("show");
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      className="btn mx-1"
                      to="/login"
                      style={{ backgroundColor: "#8682fa" }}
                      data-bs-dismiss="offcanvas"
                    >
                      Login
                    </Link>
                    <Link
                      className="btn mx-1"
                      to="/signup"
                      style={{ backgroundColor: "#8682fa" }}
                      data-bs-dismiss="offcanvas"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </nav >
    </div >
  )
}

export default Navbar
