import { useState, useEffect, useRef } from 'react'
import Productcard from './Productcard'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = ['All', 'Templates', 'Websites', 'Businesses'];
const PRICES = ['All', 'Free', 'Paid'];
const LIMIT = 12;

const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  let start = current - 2;
  let end   = current + 2;
  if (start < 1)     { start = 1;         end = Math.min(5, total); }
  if (end > total)   { end = total;        start = Math.max(1, total - 4); }

  const pages = [];
  if (start > 1) pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  if (end < total) pages.push(total);
  return pages;
};

const Home = () => {
  const navigate = useNavigate();
  const listingsRef = useRef(null);

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [category, setCategory]           = useState('All');
  const [priceFilter, setPriceFilter]     = useState('All');
  const [sort, setSort]                   = useState('newest');
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async (page) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (priceFilter === 'Free') { params.set('minPrice', '0'); params.set('maxPrice', '0'); }
    if (priceFilter === 'Paid') params.set('minPrice', '1');
    if (sort !== 'newest') params.set('sort', sort);
    params.set('page', page);
    params.set('limit', LIMIT);

    const res = await fetch(`${API}/products/getproducts?${params}`).catch(() => null);
    if (!res) { setLoading(false); return; }
    const data = await res.json().catch(() => ({}));
    setProducts(data.products || []);
    setTotalPages(data.totalPages || 1);
    setTotalProducts(data.totalProducts ?? (data.products?.length ?? 0));
    setCurrentPage(data.currentPage || page);
    setLoading(false);
  };

  // category / price / sort → reset to page 1 and fetch immediately
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [category, priceFilter, sort]);

  // search → debounced reset to page 1 and fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    fetchProducts(page);
    listingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showingStart = totalProducts === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const showingEnd   = Math.min(currentPage * LIMIT, totalProducts);

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
        <section className="wmx-listings" id="listings" ref={listingsRef}>
          <div className="wmx-section-header-row">
            <div className="wmx-section-header">
              <span className="wmx-section-tag">🔥 Hot right now</span>
              <h2 className="wmx-section-title">Featured Websites for Sale</h2>
              <p className="wmx-section-sub">
                {totalProducts} listing{totalProducts !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="wmx-search-bar">
            <input
              type="text"
              placeholder="Search websites, templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="wmx-search-input"
            />
          </div>

          <div className="wmx-listings-layout">
            {/* Cards */}
            <div className="wmx-cards-area">
              <div className="wmx-cards-grid">
                {loading ? (
                  <div className="wmx-empty"><Loader /></div>
                ) : products.length === 0 ? (
                  <div className="wmx-empty">No listings match your filters.</div>
                ) : (
                  products.map((arr, index) => (
                    <Productcard key={arr?._id || index} arr={arr} />
                  ))
                )}
              </div>

              {/* ── PAGINATION ── */}
              {!loading && totalPages > 1 && (
                <div className="wmx-pagination-wrap">
                  <div className="wmx-pagination">
                    {/* Prev */}
                    <button
                      className="wmx-page-btn wmx-page-arrow"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      ← Prev
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="wmx-page-ellipsis">…</span>
                      ) : (
                        <button
                          key={page}
                          className={`wmx-page-btn${page === currentPage ? ' wmx-page-active' : ''}`}
                          onClick={() => handlePageChange(page)}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      className="wmx-page-btn wmx-page-arrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      Next →
                    </button>
                  </div>

                  <p className="wmx-pagination-info">
                    Showing {showingStart}–{showingEnd} of {totalProducts} products
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="wmx-sidebar">
              <h3 className="wmx-sidebar-heading">
                <span className="wmx-sidebar-accent" />
                Filter
              </h3>

              <div className="wmx-sidebar-section">
                <p className="wmx-sidebar-label">Category</p>
                <div className="wmx-sidebar-filters">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`wmx-filter-btn${category === cat ? ' active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wmx-sidebar-divider" />

              <div className="wmx-sidebar-section">
                <p className="wmx-sidebar-label">Price</p>
                <div className="wmx-sidebar-filters">
                  {PRICES.map(price => (
                    <button
                      key={price}
                      className={`wmx-filter-btn${priceFilter === price ? ' active' : ''}`}
                      onClick={() => setPriceFilter(price)}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wmx-sidebar-divider" />

              <div className="wmx-sidebar-section">
                <p className="wmx-sidebar-label">Sort</p>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="wmx-sort-select"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </aside>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
