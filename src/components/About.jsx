import React, { useEffect, useRef } from "react";
import '../css/About.css';

const About = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  const features = [
    { icon: "🛒", title: "Buy Websites", desc: "Browse ready-made websites, templates & full online businesses." },
    { icon: "💰", title: "Sell Products", desc: "List your web products and reach thousands of buyers instantly." },
    { icon: "🎨", title: "Modern Designs", desc: "Only professional, high-quality designs make it to our marketplace." },
    { icon: "🚀", title: "Launch Faster", desc: "Skip months of development — start your online business today." },
  ];

  const whyUs = [
    { icon: "✦", label: "High-Quality Products" },
    { icon: "✦", label: "Easy to Use Platform" },
    { icon: "✦", label: "Affordable Pricing" },
    { icon: "✦", label: "Secure Transactions" },
    { icon: "✦", label: "Developer-Friendly System" },
  ];

  return (
    <>

      <div className="wmx-about">

        {/* HERO */}
        <div className="wmx-about-hero">
          <div className="wmx-badge">Digital Marketplace</div>
          <h1>About<br />WebMarketX</h1>
          <p>Your trusted marketplace for buying and selling web products — built for developers &amp; entrepreneurs.</p>
        </div>

        {/* WHO WE ARE + WHAT WE DO */}
        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Our Story</div>
          <h2>Who We Are</h2>
          <p>
            WebMarketX is a modern digital marketplace where developers and entrepreneurs
            can buy and sell ready-made websites, templates, and online businesses — quickly, easily, and securely.
          </p>

          <div className="wmx-grid">
            {features.map((f, i) => (
              <div className="wmx-card" key={i}>
                <span className="wmx-card-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Our Strengths</div>
          <h2>Why Choose Us</h2>
          <ul className="wmx-why-list">
            {whyUs.map((item, i) => (
              <li key={i}>
                <span className="dot"></span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* VISION */}
        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Looking Ahead</div>
          <h2>Our Vision</h2>
          <div className="wmx-vision-box">
            <p>
              "Our goal is to build a global platform where anyone can easily buy and sell
              digital products — and grow their online business without limits."
            </p>
          </div>
        </div>

        {/* CONTACT */}
        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Get in Touch</div>
          <h2>Contact Us</h2>
          <p>Have questions or want to collaborate? We'd love to hear from you.</p>
          <div className="wmx-contact-row">
            <a className="wmx-contact-item" href="mailto:ArafatKhn01867160064@gmail.com">
              <span className="ci-icon">✉️</span>
              ArafatKhn01867160064@gmail.com
            </a>
            <a className="wmx-contact-item" href="https://www.webmarketx.com" target="_blank" rel="noreferrer">
              <span className="ci-icon">🌐</span>
              www.webmarketx.com
            </a>
          </div>
        </div>

      </div>
    </>
  );
};

export default About;
