import React from "react";

const About = () => {
    return (
        <div className="container bg-light rounded p-5 my-2 fw-bold" style={{color: "#454392"}}>

            {/* Title */}
            <div className="text-center mb-5">
                <h1 className="fw-bold">About WebMarketX</h1>
                <p className="text-dark">
                    Your trusted marketplace for buying and selling web products
                </p>
            </div>

            {/* About Section */}
            <div className="mb-5">
                <h3 className="fw-bold">Who We Are</h3>
                <p>
                    WebMarketX is a modern digital marketplace where developers and
                    entrepreneurs can buy and sell ready-made websites, templates, and
                    online businesses easily.
                </p>
            </div>

            {/* What We Do */}
            <div className="mb-5">
                <h3 className="fw-bold">What We Do</h3>
                <ul>
                    <li>Buy ready-made websites and templates</li>
                    <li>Sell your own web products</li>
                    <li>Explore modern and professional designs</li>
                    <li>Start your online business faster</li>
                </ul>
            </div>

            {/* Why Choose Us */}
            <div className="mb-5">
                <h3 className="fw-bold">Why Choose Us</h3>
                <ul>
                    <li>High-quality products</li>
                    <li>Easy to use platform</li>
                    <li>Affordable pricing</li>
                    <li>Secure transactions</li>
                    <li>Developer-friendly system</li>
                </ul>
            </div>

            {/* Vision */}
            <div className="mb-5">
                <h3 className="fw-bold">Our Vision</h3>
                <p>
                    Our goal is to build a global platform where anyone can easily buy and
                    sell digital products and grow their online business.
                </p>
            </div>

            {/* Contact */}
            <div className="mb-5">
                <h3 className="fw-bold">Contact Us</h3>
                <p>Email: ArafatKhn01867160064@gmail.com</p>
                <a style={{color: "#454392"}} href="http://localhost:5173/">Website: www.webmarketx.com</a>
            </div>

        </div>
    );
};

export default About;