import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin, Globe, AtSign, Briefcase, GitBranch,
  Package, ShieldCheck, Box, Star, MessageSquare
} from 'lucide-react';
import userContext from '../context/userContext';
import Productcard from '../components/Productcard';
import ReviewSection from '../components/Reviewsection';
import '../css/PublicProfile.css';

const API = import.meta.env.VITE_API_URL;

const ProductSkeleton = () => (
  <div className="wmx-pp-skeleton">
    <div className="wmx-pp-sk-img wmx-pp-shimmer" />
    <div className="wmx-pp-sk-body">
      <div className="wmx-pp-sk-line wmx-pp-sk-title wmx-pp-shimmer" />
      <div className="wmx-pp-sk-line wmx-pp-sk-desc wmx-pp-shimmer" />
      <div className="wmx-pp-sk-line wmx-pp-sk-desc wmx-pp-sk-desc2 wmx-pp-shimmer" />
      <div className="wmx-pp-sk-footer">
        <div className="wmx-pp-sk-line wmx-pp-sk-price wmx-pp-shimmer" />
        <div className="wmx-pp-sk-line wmx-pp-sk-btn wmx-pp-shimmer" />
      </div>
    </div>
  </div>
);

const PublicProfile = () => {
  const { id } = useParams();
  const { userId } = useContext(userContext);

  const [seller, setSeller]               = useState(null);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [products, setProducts]           = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviewStats, setReviewStats]     = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    const load = async () => {
      setSellerLoading(true);
      try {
        const [sellerRes, productsRes, reviewsRes] = await Promise.all([
          fetch(`${API}/seller/public/${id}`).catch(() => null),
          fetch(`${API}/products/getbyseller/${id}`).catch(() => null),
          fetch(`${API}/reviews/seller/${id}`).catch(() => null),
        ]);

        if (sellerRes?.ok) {
          const data = await sellerRes.json().catch(() => null);
          if (data) setSeller(data.seller || data);
        }

        if (productsRes?.ok) {
          const data = await productsRes.json().catch(() => []);
          setProducts(Array.isArray(data) ? data : (data.products || []));
        }
        setProductsLoading(false);

        if (reviewsRes?.ok) {
          const data = await reviewsRes.json().catch(() => ({}));
          setReviewStats({
            averageRating: data.averageRating || 0,
            totalReviews: data.totalReviews || 0,
          });
        }
      } catch {
        setProductsLoading(false);
      } finally {
        setSellerLoading(false);
      }
    };
    load();
  }, [id]);

  const storedUser    = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUser   = userId ? { _id: userId, name: storedUser?.name || '' } : null;
  const socialLinks   = [
    { label: 'Twitter',  value: seller?.social?.twitter,  Icon: AtSign   },
    { label: 'LinkedIn', value: seller?.social?.linkedin, Icon: Briefcase },
    { label: 'GitHub',   value: seller?.social?.github,   Icon: GitBranch },
  ].filter(s => s.value);

  return (
    <div className="wmx-pp-page">

      {/* ── HERO ── */}
      <section className="wmx-pp-hero">
        <div className="wmx-pp-hero-orb wmx-pp-hero-orb-1" />
        <div className="wmx-pp-hero-orb wmx-pp-hero-orb-2" />

        <div className="wmx-pp-hero-inner">
          {/* Avatar */}
          <div className="wmx-pp-avatar-wrap">
            {seller?.profileImage
              ? <img src={seller.profileImage} alt={seller.name} className="wmx-pp-avatar wmx-pp-avatar-img" />
              : <div className="wmx-pp-avatar wmx-pp-avatar-initials">
                  {seller?.name?.[0]?.toUpperCase() || (sellerLoading ? '' : '?')}
                </div>
            }
            <span className="wmx-pp-online-dot" title="Active seller" />
          </div>

          {/* Active Seller badge */}
          <div className="wmx-pp-active-badge">
            <span className="wmx-pp-badge-pulse" />
            Active Seller
          </div>

          {/* Name */}
          <h1 className="wmx-pp-name">
            {sellerLoading ? <span className="wmx-pp-name-shimmer wmx-pp-shimmer" /> : (seller?.name || 'Unknown Seller')}
          </h1>

          {/* Tagline */}
          {seller?.sellerSettings?.tagline && (
            <p className="wmx-pp-tagline">{seller.sellerSettings.tagline}</p>
          )}

          {/* Location + website */}
          <div className="wmx-pp-meta-row">
            {seller?.location && (
              <span className="wmx-pp-meta-chip">
                <MapPin size={12} /> {seller.location}
              </span>
            )}
            {seller?.website && (
              <a
                href={seller.website}
                target="_blank"
                rel="noopener noreferrer"
                className="wmx-pp-meta-chip wmx-pp-meta-link"
              >
                <Globe size={12} /> {seller.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {seller?.isVerified && (
              <span className="wmx-pp-meta-chip wmx-pp-meta-verified">
                <ShieldCheck size={12} /> Verified
              </span>
            )}
          </div>

          {/* Stat chips */}
          <div className="wmx-pp-stats-row">
            <div className="wmx-pp-stat-chip">
              <span className="wmx-pp-stat-icon"><Box size={14} /></span>
              <span className="wmx-pp-stat-val">{products.length}</span>
              <span className="wmx-pp-stat-lbl">Products</span>
            </div>
            <div className="wmx-pp-stat-chip">
              <span className="wmx-pp-stat-icon"><Star size={14} /></span>
              <span className="wmx-pp-stat-val">
                {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : '—'}
              </span>
              <span className="wmx-pp-stat-lbl">Rating</span>
            </div>
            <div className="wmx-pp-stat-chip">
              <span className="wmx-pp-stat-icon"><MessageSquare size={14} /></span>
              <span className="wmx-pp-stat-val">{reviewStats.totalReviews}</span>
              <span className="wmx-pp-stat-lbl">Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="wmx-pp-body">

        {/* ── ABOUT ── */}
        <section className="wmx-pp-section">
          <h2 className="wmx-pp-section-title">
            <span className="wmx-pp-section-accent" />
            About
          </h2>

          <p className="wmx-pp-bio">
            {seller?.bio || "This seller hasn't added a bio yet."}
          </p>

          <div className="wmx-pp-about-row">
            {seller?.sellerSettings?.category && (
              <span className="wmx-pp-category-badge">
                {seller.sellerSettings.category}
              </span>
            )}

            {socialLinks.length > 0 && (
              <div className="wmx-pp-social-row">
                {socialLinks.map(({ label, value, Icon }) => (
                  <a
                    key={label}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wmx-pp-social-btn"
                    title={label}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="wmx-pp-section">
          <h2 className="wmx-pp-section-title">
            <span className="wmx-pp-section-accent" />
            Products by {seller?.name || 'this seller'}
          </h2>

          {productsLoading ? (
            <div className="wmx-pp-grid">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          ) : products.length === 0 ? (
            <div className="wmx-pp-empty">
              <Package size={36} className="wmx-pp-empty-icon" />
              <p>This seller hasn't listed any products yet.</p>
            </div>
          ) : (
            <div className="wmx-pp-grid">
              {products.map((p, i) => (
                <Productcard key={p._id || i} arr={p} />
              ))}
            </div>
          )}
        </section>

        {/* ── REVIEWS ── */}
        <section className="wmx-pp-section">
          <ReviewSection
            sellerId={id}
            currentUser={currentUser}
            showAlert={() => {}}
          />
        </section>

      </div>
    </div>
  );
};

export default PublicProfile;
