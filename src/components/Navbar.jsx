import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../Navbar.css';

const Navbar = ({ showAlert }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        showAlert("You are login out", 'warning')
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
            <nav className={`navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top ${show ? 'navbar-show' : 'navbar-hide'}`} >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/"><img
                        src="/logo.png"
                        alt="Logo"
                        width="55"
                        height="35"
                        className="d-inline-block align-top me-2"
                    /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse custom-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link mx-2 active" style={{ color: "#8682fa" }} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link mx-2" style={{ color: "#8682fa" }} to="/addproducts">Add Website</Link>
                            </li>
                        </ul>
                        <form className="d-flex">{token ? (<button type='button' className='btn btn-primary mx-1' onClick={handleLogout}>Logout</button>) : (<>
                            <Link className="btn btn-primary mx-1" type="submit" to="/login">Login</Link>
                            <Link className="btn btn-primary mx-1" type="submit" to="/signup">Signup</Link>
                        </>
                        )}
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
