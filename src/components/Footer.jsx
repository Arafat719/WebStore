import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook,  faLinkedin, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import FiverrI from '../assets/Fiverr.png'

const Footer = () => {
    return (
        <div>
            <footer className="shadow text-white pt-5 pb-3" style={{background: "#2b1d1d8e"}}>
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
                                <li><Link to="/addproducts" className="text-white text-decoration-none">Add Websites</Link></li>
                                <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
                            </ul>
                        </div>

                        <div className="col-md-3 mb-4">
                            <h5 className="fw-bold">Contact</h5>
                            <p>Email: webmarketx1@gmail.com</p>
                            <p>Phone: +880 1885327180</p>
                            <p>Address: Dhaka, Bangladesh</p>
                        </div>

                        <div className="col-md-3 mb-4">
                            <h5 className="fw-bold">Follow Us</h5>
                            <a href="https://github.com/webmarketx1-maker" target='_blank' className="text-white me-3"><i className="bi bi-github"><FontAwesomeIcon style={{ color: "#8682fa" }} icon={faGithub} /></i></a>
                            <a href="https://www.facebook.com/share/1AhxGuw7xY/" target='_blank' className="text-white me-3"><i className="bi bi-facebook"><FontAwesomeIcon style={{ color: "#8682fa" }} icon={faFacebook} /></i></a>
                            <a href="https://wa.me/8801867160064" target='_blank' className="text-white me-3"><i className="bi bi-instagram"><FontAwesomeIcon style={{ color: "#8682fa" }} icon={faWhatsapp} /></i></a>
                            <a href="https://www.fiverr.com/arafatkhan147/buying?source=avatar_menu_profile" target='_blank' className="text-white me-3"><img src={FiverrI} alt='Fiverr' style={{width:"20px"}}></img></a>
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
