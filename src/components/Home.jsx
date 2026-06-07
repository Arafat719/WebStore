import React, { useContext } from 'react'
import userContext from '../context/userContext'
import Productcard from './Productcard'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'

const Home = ({ showAlert }) => {
  const context = useContext(userContext)
  const { array, loading } = context;
  const navigate = useNavigate()

  const handleScroll = () => {
    document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .wmx-home {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .wmx-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 0 24px;
        }

        /* Animated gradient orbs */
        .wmx-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: wmx-float 8s ease-in-out infinite;
        }
        .wmx-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(134,130,250,0.22) 0%, transparent 70%);
          top: -100px; left: -80px;
          animation-delay: 0s;
        }
        .wmx-orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(91,88,200,0.18) 0%, transparent 70%);
          bottom: -60px; right: 5%;
          animation-delay: 3s;
        }
        .wmx-orb-3 {
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(160,157,255,0.12) 0%, transparent 70%);
          top: 30%; right: 25%;
          animation-delay: 5s;
        }

        @keyframes wmx-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }

        /* Grid dot texture */
        .wmx-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(134,130,250,0.08) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        .wmx-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 80px 0 60px;
        }

        .wmx-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8682fa;
          background: rgba(134,130,250,0.1);
          border: 1px solid rgba(134,130,250,0.22);
          border-radius: 30px;
          padding: 5px 14px;
          margin-bottom: 28px;
        }
        .wmx-eyebrow-dot {
          width: 6px; height: 6px;
          background: #8682fa;
          border-radius: 50%;
          animation: wmx-pulse 2s ease-in-out infinite;
        }
        @keyframes wmx-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .wmx-hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.6rem, 6vw, 5rem);
          line-height: 1.08;
          color: #f2f2ff;
          letter-spacing: -2px;
          margin-bottom: 24px;
        }
        .wmx-hero-title .accent {
          background: linear-gradient(135deg, #8682fa 0%, #b8b5ff 60%, #e0dfff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .wmx-hero-sub {
          font-size: 1.05rem;
          color: #6a6a80;
          font-weight: 300;
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 44px;
          font-style: italic;
        }

        .wmx-hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 64px;
        }

        .wmx-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          color: #fff;
          background: linear-gradient(135deg, #8682fa, #5f5bc7);
          border: none;
          border-radius: 12px;
          padding: 13px 26px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 6px 24px rgba(134,130,250,0.35);
        }
        .wmx-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(134,130,250,0.5);
          color: #fff;
        }

        .wmx-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          color: #8682fa;
          background: rgba(134,130,250,0.08);
          border: 1px solid rgba(134,130,250,0.25);
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .wmx-btn-ghost:hover {
          background: rgba(134,130,250,0.16);
          border-color: rgba(134,130,250,0.45);
          color: #b8b5ff;
          transform: translateY(-2px);
        }

        /* Stats bar */
        .wmx-stats {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
        }
        .wmx-stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .wmx-stat-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.6rem;
          color: #f2f2ff;
          letter-spacing: -1px;
          line-height: 1;
        }
        .wmx-stat-num span {
          color: #8682fa;
        }
        .wmx-stat-label {
          font-size: 0.72rem;
          color: #4a4a5a;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* ── LISTINGS SECTION ── */
        .wmx-listings {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .wmx-section-header {
          margin-bottom: 48px;
        }

        .wmx-section-tag {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #8682fa;
          margin-bottom: 10px;
          display: block;
        }

        .wmx-section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          color: #f2f2ff;
          letter-spacing: -1px;
          margin: 0 0 10px;
        }

        .wmx-section-sub {
          font-size: 0.875rem;
          color: #5a5a6e;
          font-weight: 300;
          margin: 0;
        }

        /* Divider line accent */
        .wmx-section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 32px;
          margin-bottom: 40px;
        }

        /* Cards grid */
        .wmx-cards-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: flex-start;
        }

        /* Empty / loader state */
        .wmx-empty {
          width: 100%;
          text-align: center;
          padding: 80px 0;
          color: #3a3a4a;
          font-size: 0.9rem;
          font-style: italic;
        }

        /* Scroll indicator */
        .wmx-scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.2s;
          z-index: 2;
        }
        .wmx-scroll-hint:hover { opacity: 0.8; }
        .wmx-scroll-hint span {
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8682fa;
        }
        .wmx-scroll-mouse {
          width: 20px; height: 32px;
          border: 1.5px solid rgba(134,130,250,0.4);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          padding-top: 5px;
        }
        .wmx-scroll-dot {
          width: 3px; height: 7px;
          background: #8682fa;
          border-radius: 2px;
          animation: wmx-scroll-anim 1.8s ease-in-out infinite;
        }
        @keyframes wmx-scroll-anim {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }

        @media (max-width: 640px) {
          .wmx-stats { gap: 28px; }
          .wmx-cards-grid { justify-content: center; }
          .wmx-section-header-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="wmx-home">

        {/* ── HERO ── */}
        <section className="wmx-hero">
          <div className="wmx-orb wmx-orb-1" />
          <div className="wmx-orb wmx-orb-2" />
          <div className="wmx-orb wmx-orb-3" />

          <div className="wmx-hero-content">

            <div className="wmx-eyebrow">
              <span className="wmx-eyebrow-dot" />
              Digital Marketplace
            </div>

            <h1 className="wmx-hero-title">
              Buy &amp; Sell<br />
              <span className="accent">Websites</span> Easily
            </h1>

            <p className="wmx-hero-sub">
              Find the best websites, templates &amp; online businesses.<br />
              Your next digital asset is just one click away.
            </p>

            <div className="wmx-hero-actions">
              <button className="wmx-btn-primary" onClick={handleScroll}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Explore Listings
              </button>
              <button className="wmx-btn-ghost" onClick={() => navigate('/addproducts')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="#8682fa" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Sell Your Website
              </button>
            </div>

            <div className="wmx-stats">
              <div className="wmx-stat-item">
                <div className="wmx-stat-num">2<span>K+</span></div>
                <div className="wmx-stat-label">Listings</div>
              </div>
              <div className="wmx-stat-item">
                <div className="wmx-stat-num">850<span>+</span></div>
                <div className="wmx-stat-label">Buyers</div>
              </div>
              <div className="wmx-stat-item">
                <div className="wmx-stat-num">99<span>%</span></div>
                <div className="wmx-stat-label">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="wmx-scroll-hint" onClick={handleScroll}>
            <div className="wmx-scroll-mouse">
              <div className="wmx-scroll-dot" />
            </div>
            <span>Scroll</span>
          </div>
        </section>

        {/* ── LISTINGS ── */}
        <section className="wmx-listings" id="listings">
          <div className="wmx-section-header-row">
            <div className="wmx-section-header">
              <span className="wmx-section-tag">🔥 Hot right now</span>
              <h2 className="wmx-section-title">Featured Websites for Sale</h2>
              <p className="wmx-section-sub">Hand-picked listings available right now.</p>
            </div>
          </div>

          <div className="wmx-cards-grid">
            {loading ? (
              <div className="wmx-empty"><Loader /></div>
            ) : array.length === 0 ? (
              <div className="wmx-empty">No listings found yet.</div>
            ) : (
              array.map((arr, index) => (
                <Productcard key={arr?._id || index} arr={arr} />
              ))
            )}
          </div>
        </section>

      </div>
    </>
  )
}

export default Home