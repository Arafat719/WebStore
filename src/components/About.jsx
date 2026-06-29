import React, { useEffect, useRef, useState } from "react";
import '../css/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping, faMoneyBillWave, faPaintbrush, faRocket,
  faGlobe, faLaptop, faFolderOpen, faEnvelope,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
  const sectionsRef = useRef([]);
  const [openFaq, setOpenFaq] = useState(null);

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
    { icon: faCartShopping,   title: "Buy Websites",    desc: "Browse ready-made websites, templates & full online businesses." },
    { icon: faMoneyBillWave,  title: "Sell Products",   desc: "List your web products and reach thousands of buyers instantly." },
    { icon: faPaintbrush,     title: "Modern Designs",  desc: "Only professional, high-quality designs make it to our marketplace." },
    { icon: faRocket,         title: "Launch Faster",   desc: "Skip months of development — start your online business today." },
  ];

  const whyUs = [
    { label: "High-Quality Products" },
    { label: "Easy to Use Platform" },
    { label: "Affordable Pricing" },
    { label: "Secure Transactions" },
    { label: "Developer-Friendly System" },
  ];

  const stats = [
    { num: "2K+",  label: "Products Listed" },
    { num: "850+", label: "Happy Buyers" },
    { num: "20+",  label: "Active Sellers" },
    { num: "99%",  label: "Satisfaction Rate" },
  ];

  const products = [
    { icon: faGlobe,       title: "Website Templates",  desc: "Ready-made website templates you can customize and launch instantly." },
    { icon: faLaptop,      title: "Full Websites",       desc: "Complete, functional websites built and ready for deployment." },
    { icon: faFolderOpen,  title: "GitHub Repositories", desc: "Source code repos with full documentation — download and build on top." },
    { icon: faPaintbrush,  title: "UI Kits & Assets",    desc: "Design systems, component kits and frontend assets for developers." },
  ];

  const buyerSteps = [
    { n: "01", title: "Browse & Discover",  desc: "Search and filter through hundreds of digital products." },
    { n: "02", title: "One-Time Purchase",  desc: "Buy once, own forever. No subscriptions, no hidden fees." },
    { n: "03", title: "Download & Launch",  desc: "Instantly access your files and launch your next project." },
  ];

  const sellerSteps = [
    { n: "01", title: "Create an Account", desc: "Sign up as a Seller — it takes less than 2 minutes." },
    { n: "02", title: "List Your Product", desc: "Add your GitHub repo, images, description and set your price." },
    { n: "03", title: "Start Earning",     desc: "Buyers find your product and you get paid directly." },
  ];

  const faqs = [
    { q: "Is it free to sign up?",           a: "Yes. Creating a buyer or seller account on WebMarketX is completely free." },
    { q: "What type of products can I sell?", a: "You can sell websites, web templates, GitHub repositories, UI kits and other digital web products." },
    { q: "How do I list my product?",         a: "Sign up as a Seller, go to your dashboard and click Add Product. Fill in your GitHub repo URL, images, description and price — done in under 5 minutes." },
    { q: "Do buyers get lifetime access?",    a: "Yes. Every purchase is a one-time payment and the product is yours to keep forever." },
    { q: "Is my purchase secure?",            a: "Yes. All transactions are processed securely. Your payment and personal data are fully protected." },
    { q: "How do I contact support?",         a: "Email us at webmarketx1@gmail.com and we'll get back to you within 24 hours." },
  ];

  return (
    <>
      <div className="wmx-about">

        <div className="wmx-about-hero">
          <div className="wmx-badge">Digital Marketplace</div>
          <h1>About<br />WebMarketX</h1>
          <p>Your trusted marketplace for buying and selling web products — built for developers &amp; entrepreneurs.</p>
        </div>

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
                <span className="wmx-card-icon"><FontAwesomeIcon icon={f.icon} /></span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

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

        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">By The Numbers</div>
          <h2>WebMarketX At A Glance</h2>
          <div className="wmx-stats-grid">
            {stats.map((s, i) => (
              <div className="wmx-stat-card" key={i}>
                <div className="wmx-stat-num">{s.num}</div>
                <div className="wmx-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Our Products</div>
          <h2>What's Available on WebMarketX</h2>
          <div className="wmx-grid">
            {products.map((p, i) => (
              <div className="wmx-card" key={i}>
                <span className="wmx-card-icon"><FontAwesomeIcon icon={p.icon} /></span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Simple Process</div>
          <h2>How It Works</h2>
          <div className="wmx-hiw-cols">
            <div className="wmx-hiw-col">
              <div className="wmx-hiw-col-title">For Buyers</div>
              {buyerSteps.map((s, i) => (
                <div className="wmx-hiw-step" key={i}>
                  <div className="wmx-step-num">{s.n}</div>
                  <div>
                    <div className="wmx-step-title">{s.title}</div>
                    <div className="wmx-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="wmx-hiw-col">
              <div className="wmx-hiw-col-title">For Sellers</div>
              {sellerSteps.map((s, i) => (
                <div className="wmx-hiw-step" key={i}>
                  <div className="wmx-step-num">{s.n}</div>
                  <div>
                    <div className="wmx-step-title">{s.title}</div>
                    <div className="wmx-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Common Questions</div>
          <h2>Frequently Asked Questions</h2>
          <div className="wmx-faq-list">
            {faqs.map((faq, i) => (
              <div className="wmx-faq-item" key={i}>
                <button
                  className={`wmx-faq-q${openFaq === i ? ' open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`wmx-faq-icon${openFaq === i ? ' open' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="wmx-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">By WebMarketX Team</div>
          <h2>Our Services</h2>
          <p>
            Beyond the marketplace, the WebMarketX team builds open-source developer tools
            to help you work faster and smarter.
          </p>
          <div className="wmx-vision-box wmx-services-box">
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>wmx-os — Developer CLI</h3>
            <p style={{ marginBottom: '1.2rem' }}>
              A powerful command-line toolkit built for modern web developers — scaffold projects,
              scan dependencies, generate docs, manage environments and more. 12 commands, fully offline-capable.
            </p>
            <a
              href="https://wmx-os-developer.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="wmx-services-link"
            >
              Explore wmx-os →
            </a>
          </div>
        </div>

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

        <div className="wmx-section wmx-fade" ref={addRef}>
          <div className="wmx-label">Get in Touch</div>
          <h2>Contact Us</h2>
          <p>Have questions or want to collaborate? We'd love to hear from you.</p>
          <div className="wmx-contact-row">
            <a className="wmx-contact-item" href="mailto:webmarketx1@gmail.com">
              <span className="ci-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
              webmarketx1@gmail.com
            </a>
            <a className="wmx-contact-item" href="https://www.webmarketx.com" target="_blank" rel="noreferrer">
              <span className="ci-icon"><FontAwesomeIcon icon={faGlobe} /></span>
              www.webmarketx.com
            </a>
          </div>
        </div>

      </div>
    </>
  );
};

export default About;
