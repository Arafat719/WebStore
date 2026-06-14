import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone, faLocationDot, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import FiverrI from '../assets/Fiverr.png';
import '../css/Footer.css';

const Footer = () => {
    return (
        <>

            <footer className="wmx-footer">
                <div className="wmx-footer-inner">
                    <div className="wmx-grid">

                        {/* Brand Column */}
                        <div className="wmx-brand-col">
                            <div className="wmx-brand-tag">Digital Marketplace</div>
                            <div className="wmx-brand-name">Web<span>Market</span>X</div>
                            <p className="wmx-brand-desc">
                                Your one-stop marketplace to buy and sell websites, templates, and online businesses — fast and securely.
                            </p>
                            <div className="wmx-socials">
                                <a href="https://github.com/webmarketx1-maker" target="_blank" rel="noreferrer" className="wmx-social-btn">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                                <a href="https://www.facebook.com/share/1AhxGuw7xY/" target="_blank" rel="noreferrer" className="wmx-social-btn">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                                <a href="https://wa.me/8801867160064" target="_blank" rel="noreferrer" className="wmx-social-btn">
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </a>
                                <a href="mailto:webmarketx1@gmail.com" className="wmx-social-btn">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </a>
                                <a href="https://www.fiverr.com/arafatkhan147/buying?source=avatar_menu_profile" target="_blank" rel="noreferrer" className="wmx-social-btn wmx-fiverr-btn">
                                    <img src={FiverrI} alt="Fiverr" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h5 className="wmx-col-title">Quick Links</h5>
                            <ul className="wmx-nav-list">
                                <li>
                                    <Link to="/">
                                        <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/addproducts">
                                        <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                                        Add Website
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about">
                                        <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h5 className="wmx-col-title">Contact</h5>
                            <ul className="wmx-contact-list">
                                <li className="wmx-contact-item">
                                    <FontAwesomeIcon icon={faEnvelope} className="wmx-contact-icon" />
                                    <span>webmarketx1@gmail.com</span>
                                </li>
                                <li className="wmx-contact-item">
                                    <FontAwesomeIcon icon={faPhone} className="wmx-contact-icon" />
                                    <span>+880 1885327180</span>
                                </li>
                                <li className="wmx-contact-item">
                                    <FontAwesomeIcon icon={faLocationDot} className="wmx-contact-icon" />
                                    <span>Dhaka, Bangladesh</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <hr className="wmx-divider" />

                    <div className="wmx-bottom">
                        <p className="wmx-copyright mb-0">
                            &copy; 2026 <span>WebMarketX</span>. All rights reserved.
                        </p>
                        <div className="wmx-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;