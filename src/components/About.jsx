import React, { useEffect, useRef } from "react";

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .wmx-about * { box-sizing: border-box; margin: 0; padding: 0; }

        .wmx-about {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          color: #e8e6f0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* HERO */
        .wmx-hero {
          position: relative;
          padding: 120px 40px 100px;
          text-align: center;
          overflow: hidden;
        }
        .wmx-hero::before {
          content: '';
          position: absolute;
          top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(69,67,146,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .wmx-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #454392, transparent);
        }
        .wmx-badge {
          display: inline-block;
          border: 1px solid rgba(69,67,146,0.6);
          background: rgba(69,67,146,0.12);
          color: #9d9bff;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 100px;
          margin-bottom: 32px;
          font-family: 'DM Sans', sans-serif;
        }
        .wmx-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 30%, #9d9bff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 24px;
        }
        .wmx-hero p {
          font-size: 18px;
          color: #9b99b4;
          font-weight: 300;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* SCROLL ANIMATIONS */
        .wmx-fade {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .wmx-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* SECTION WRAPPER */
        .wmx-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 40px;
        }
        .wmx-section + .wmx-section {
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .wmx-label {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b69a0;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 16px;
        }
        .wmx-section h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .wmx-section p {
          color: #9b99b4;
          font-size: 16px;
          line-height: 1.8;
          font-weight: 300;
          max-width: 600px;
        }

        /* FEATURE CARDS */
        .wmx-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 48px;
        }
        .wmx-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px 24px;
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
          cursor: default;
        }
        .wmx-card:hover {
          border-color: rgba(69,67,146,0.5);
          background: rgba(69,67,146,0.08);
          transform: translateY(-4px);
        }
        .wmx-card-icon {
          font-size: 28px;
          margin-bottom: 16px;
          display: block;
        }
        .wmx-card h3 {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }
        .wmx-card p {
          font-size: 14px;
          color: #7a789a;
          line-height: 1.7;
          font-weight: 300;
        }

        /* WHY US LIST */
        .wmx-why-list {
          list-style: none;
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .wmx-why-list li {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 16px;
          color: #c4c2dd;
          font-weight: 400;
          transition: color 0.2s;
        }
        .wmx-why-list li:hover { color: #fff; }
        .wmx-why-list li span.dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #454392;
          flex-shrink: 0;
          box-shadow: 0 0 10px rgba(69,67,146,0.8);
        }

        /* VISION */
        .wmx-vision-box {
          position: relative;
          background: linear-gradient(135deg, rgba(69,67,146,0.15), rgba(69,67,146,0.05));
          border: 1px solid rgba(69,67,146,0.3);
          border-radius: 20px;
          padding: 52px 48px;
          overflow: hidden;
          margin-top: 0;
        }
        .wmx-vision-box::before {
          content: '◈';
          position: absolute;
          top: -20px; right: 40px;
          font-size: 120px;
          color: rgba(69,67,146,0.1);
          font-family: 'Syne', sans-serif;
          line-height: 1;
          pointer-events: none;
        }
        .wmx-vision-box p {
          font-size: 18px;
          font-style: italic;
          color: #ceccee;
          line-height: 1.8;
          font-weight: 300;
          max-width: 560px;
        }

        /* CONTACT */
        .wmx-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 36px;
        }
        .wmx-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px 24px;
          text-decoration: none;
          color: #c4c2dd;
          font-size: 14px;
          transition: border-color 0.3s, color 0.3s, background 0.3s;
        }
        .wmx-contact-item:hover {
          border-color: #454392;
          color: #fff;
          background: rgba(69,67,146,0.12);
        }
        .wmx-contact-item .ci-icon {
          font-size: 18px;
        }

        @media (max-width: 600px) {
          .wmx-hero { padding: 80px 24px 70px; }
          .wmx-section { padding: 60px 24px; }
          .wmx-vision-box { padding: 36px 28px; }
        }
      `}</style>

      <div className="wmx-about">

        {/* HERO */}
        <div className="wmx-hero">
          <div className="wmx-badge">Digital Marketplace</div>
          <h1>About<br />WebMarketX</h1>
          <p>Your trusted marketplace for buying and selling web products — built for developers & entrepreneurs.</p>
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
