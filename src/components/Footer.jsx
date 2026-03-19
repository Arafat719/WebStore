import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook, faInstagram, faLinkedin, faTwitter, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div>
            <footer className="bg-dark text-white pt-5 pb-3">
                <div className="container">
                    <div className="row">

                        <div className="col-md-4 mb-4">
                            <h4 className="fw-bold">WebMarketX</h4>
                            <p>Your one-stop marketplace to buy & sell websites easily.</p>
                        </div>

                        <div className="col-md-2 mb-4">
                            <h5 className="fw-bold">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                                <li><Link to="/addproducts" className="text-white text-decoration-none">Add Products</Link></li>
                                <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
                            </ul>
                        </div>

                        <div className="col-md-3 mb-4">
                            <h5 className="fw-bold">Contact</h5>
                            <p>Email: ArafatKhn01867160064@gmail.com</p>
                            <p>Phone: +880 1867160064</p>
                            <p>Address: Dhaka, Bangladesh</p>
                        </div>

                        <div className="col-md-3 mb-4">
                            <h5 className="fw-bold">Follow Us</h5>
                            <a href="https://github.com/Arafat719" target='_blank' className="text-white me-3"><i className="bi bi-github"><FontAwesomeIcon icon={faGithub} /></i></a>
                            <a href="https://www.facebook.com/share/1FtK2S6E1g/" target='_blank' className="text-white me-3"><i className="bi bi-facebook"><FontAwesomeIcon icon={faFacebook} /></i></a>
                            <a href="https://www.instagram.com/arafat92126" target='_blank' className="text-white me-3"><i className="bi bi-instagram"><FontAwesomeIcon icon={faInstagram} /></i></a>
                            <a href="https://www.linkedin.com/in/arafat-khan-34b08335a/" target='_blank' className="text-white me-3"><i className="bi bi-linkedin"><FontAwesomeIcon icon={faLinkedin} /></i></a>
                        </div>

                    </div>

                    <hr className="bg-white"/>
                        <p className="text-center mb-0">&copy; 2026 WebMarketX. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer
