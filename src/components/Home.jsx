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