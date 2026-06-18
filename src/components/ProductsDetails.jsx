import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faStar, faArrowLeft, faGlobe, faDownload,
  faCalendar, faRefresh, faFileLines, faHeadset,
  faTag, faCode, faUser, faAlignLeft, faImage
} from '@fortawesome/free-solid-svg-icons';
import '../css/ProductsDetails.css';
import ReviewSection from "./Reviewsection";
import userContext from "../context/userContext";

const ProductDetails = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [previewMsg, setPreviewMsg] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistToast, setWishlistToast] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { userId } = useContext(userContext);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = userId ? { _id: userId, name: storedUser?.name || "" } : null;
  const API = import.meta.env.VITE_API_URL;
  const images = product?.images ?? [];

  useEffect(() => {
    fetch(`${API}/products/getbyid/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;
    fetch(`${API}/wishlist/check/${id}`, { headers: { token } })
      .then(res => res.json())
      .then(data => setWishlisted(!!data.wishlisted))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, images.length]);

  const handleDownload = async () => {
    const githubUsername = import.meta.env.VITE_GITHUB_USERNAME;
    const res = await fetch(
      `${API}/git/download/${githubUsername}/${product?.repoName}`,
      { headers: { "token": localStorage.getItem("token") } }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showAlert(err.error || "Download failed. Make sure you have purchased this product.", "error");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product?.repoName}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBuy = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showAlert("Please login to purchase", "warning");
      navigate("/login");
      return;
    }
    const res = await fetch(`${API}/orders/initiate`, {
      method: "POST",
      headers: { "token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.error || "Purchase failed", "error");
      return;
    }
    if (data.free) {
      showAlert("Added to your orders! You can now download.", "success");
      return;
    }
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        const res = await fetch(`${API}/wishlist/remove/${product._id}`, {
          method: 'DELETE',
          headers: { token },
        });
        if (res.ok) {
          setWishlisted(false);
          setWishlistToast('Removed from wishlist');
          setTimeout(() => setWishlistToast(''), 2500);
        }
      } else {
        const res = await fetch(`${API}/wishlist/add`, {
          method: 'POST',
          headers: { token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });
        if (res.ok) {
          setWishlisted(true);
          setWishlistToast('Added to wishlist ♥');
          setTimeout(() => setWishlistToast(''), 2500);
        }
      }
    } catch {}
    finally { setWishlistLoading(false); }
  };

  if (!product) return (
    <div className="wmx-pd-loading">
      <div className="wmx-pd-spinner" />
      <p className="wmx-pd-loading-text">Loading product...</p>
    </div>
  );

  const isFree = product.price === "Free" || product.price === 0;
  const isOwnProduct = userId && (
    userId === product.sellerId ||
    userId === product.seller?._id ||
    userId === product.sellerId?._id
  );

  return (
    <div className="wmx-pd">

      <div className="wmx-pd-topbar">
        <button className="wmx-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to listings
        </button>
      </div>

      <div className="wmx-pd-layout">

        {/* LEFT PANEL */}
        <div className="wmx-left-panel">

          <div className="wmx-img-box">
            {images.length > 0 ? (
              <img src={images[0]} alt={product.title} className="wmx-hero-img" />
            ) : (
              <div className="wmx-img-placeholder">
                <FontAwesomeIcon icon={faImage} />
                <span>No image</span>
              </div>
            )}
            <div className="wmx-img-badge">
              <span className="wmx-pulse-dot" />
              Digital Product
            </div>
          </div>

          {images.length > 1 && (
            <div className="wmx-thumbs">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`wmx-thumb${lightboxIndex === i ? ' active' : ''}`}
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                >
                  <img src={img} alt={`thumb-${i}`} />
                </div>
              ))}
            </div>
          )}

          <div className="wmx-pd-eyebrow">
            <span className="wmx-pulse-dot" />
            Website Template
          </div>
          <h1 className="wmx-product-title">{product.title}</h1>
          <div className="wmx-meta">
            <Link
              to={`/seller/${product.seller?._id || product.sellerId?._id || product.sellerId || ''}`}
              className="wmx-chip wmx-chip-seller"
            >
              <FontAwesomeIcon icon={faUser} />
              {product.seller?.name || product.sellerName || product.sellerId?.name || 'View Seller'}
            </Link>
            <span className="wmx-chip wmx-chip-stars">
              {[1,2,3,4,5].map(s => (
                <FontAwesomeIcon
                  key={s} icon={faStar}
                  className={s <= product.rating ? 'wmx-star-on' : 'wmx-star-off'}
                />
              ))}
              <span className="wmx-chip-rating">{product.rating}</span>
            </span>
            <span className="wmx-chip">{product.totalReviews} reviews</span>
          </div>

          <div className="wmx-section">
            <div className="wmx-sec-title">
              <FontAwesomeIcon icon={faAlignLeft} />
              Description
            </div>
            <p className="wmx-desc">{product.description}</p>
          </div>

          <div className="wmx-section">
            <div className="wmx-sec-title">
              <FontAwesomeIcon icon={faCheck} />
              Features
            </div>
            <div className="wmx-features-grid">
              {product.features?.map((f, i) => (
                <div key={i} className="wmx-feature-item">
                  <FontAwesomeIcon icon={faCheck} className="wmx-feature-check" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <div className="wmx-section">
              <div className="wmx-sec-title">
                <FontAwesomeIcon icon={faImage} />
                Gallery
              </div>
              <div className="wmx-gallery">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`gallery-${i}`}
                    className={lightboxIndex === i ? 'active' : ''}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="wmx-right-panel">

          <div className="wmx-price-hero">
            <div className={`wmx-price-val${isFree ? ' free' : ''}`}>
              {isFree ? 'Free' : `$${product.price}`}
            </div>
            <div className="wmx-price-note">One-time purchase</div>
            {isOwnProduct ? (
              <div className="wmx-own-product-label">This is your product</div>
            ) : (
              <div className="wmx-buy-row">
                <button className="wmx-buy-btn" onClick={isFree ? handleDownload : handleBuy}>
                  <FontAwesomeIcon icon={faDownload} />
                  {isFree ? 'Download Free' : 'Buy Now'}
                </button>
                <button
                  className={`wmx-wishlist-btn${wishlisted ? ' active' : ''}`}
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlisted ? '♥' : '♡'}
                </button>
              </div>
            )}
            <button
              className={`wmx-preview-btn${!product.livePreviewUrl ? ' wmx-preview-btn--disabled' : ''}`}
              onClick={() => {
                if (product.livePreviewUrl) {
                  window.open(product.livePreviewUrl, '_blank', 'noreferrer');
                } else {
                  setPreviewMsg(true);
                }
              }}
            >
              <FontAwesomeIcon icon={faGlobe} />
              Live Preview
            </button>
            {previewMsg && !product.livePreviewUrl && (
              <div className="wmx-preview-unavail">No live preview available for this product</div>
            )}
          </div>

          <div className="wmx-r-card">
            <div className="wmx-r-title">Product Info</div>
            <div className="wmx-irow">
              <div className="wmx-iico"><FontAwesomeIcon icon={faCalendar} /></div>
              <div><div className="wmx-ilbl">Uploaded</div><div className="wmx-ival">{new Date(product.createdAt).toDateString()}</div></div>
            </div>
            <div className="wmx-irow">
              <div className="wmx-iico"><FontAwesomeIcon icon={faRefresh} /></div>
              <div><div className="wmx-ilbl">Last Updated</div><div className="wmx-ival">{new Date(product.updatedAt).toDateString()}</div></div>
            </div>
            <div className="wmx-irow">
              <div className="wmx-iico"><FontAwesomeIcon icon={faFileLines} /></div>
              <div><div className="wmx-ilbl">Documentation</div><div className="wmx-ival">{product.documentation ? 'Included ✓' : 'Not Included'}</div></div>
            </div>
            <div className="wmx-irow">
              <div className="wmx-iico"><FontAwesomeIcon icon={faHeadset} /></div>
              <div><div className="wmx-ilbl">Support</div><div className="wmx-ival">{product.support}</div></div>
            </div>
          </div>

          <div className="wmx-r-card">
            <div className="wmx-r-title">
              <FontAwesomeIcon icon={faCode} style={{ marginRight: 6 }} />
              Built With
            </div>
            <div className="wmx-tags" style={{ marginBottom: 14 }}>
              {product.builtWith?.map((item, i) => (
                <span key={i} className="wmx-tag wmx-tag-t">{item}</span>
              ))}
            </div>
            <div className="wmx-divider" />
            <div className="wmx-r-title">
              <FontAwesomeIcon icon={faTag} style={{ marginRight: 6 }} />
              Tags
            </div>
            <div className="wmx-tags">
              {product.tags?.map((tag, i) => (
                <span key={i} className="wmx-tag wmx-tag-l">{tag}</span>
              ))}
            </div>
          </div>

          <div className="wmx-r-card">
            <div className="wmx-r-title">Rating & Reviews</div>
            <div className="wmx-rat-row">
              <div className="wmx-rat-num">{product.rating}</div>
              <div>
                <div className="wmx-rat-stars">
                  {[1,2,3,4,5].map(s => (
                    <FontAwesomeIcon key={s} icon={faStar} className={s <= product.rating ? 'wmx-star-on' : 'wmx-star-off'} />
                  ))}
                </div>
                <div className="wmx-rat-c">{product.totalReviews} reviews</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="wmx-pd-reviews">
        <ReviewSection productId={product._id} currentUser={currentUser} showAlert={showAlert} />
      </div>

      {lightboxOpen && images.length > 0 && (
        <div className="wmx-lb-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="wmx-lb-modal" onClick={e => e.stopPropagation()}>
            <button className="wmx-lb-close" onClick={() => setLightboxOpen(false)}>✕</button>
            {images.length > 1 && (
              <button className="wmx-lb-arrow wmx-lb-prev" onClick={() => setLightboxIndex(i => (i - 1 + images.length) % images.length)}>‹</button>
            )}
            <img src={images[lightboxIndex]} alt={`preview-${lightboxIndex}`} className="wmx-lb-img" />
            {images.length > 1 && (
              <button className="wmx-lb-arrow wmx-lb-next" onClick={() => setLightboxIndex(i => (i + 1) % images.length)}>›</button>
            )}
            {images.length > 1 && (
              <div className="wmx-lb-counter">{lightboxIndex + 1} / {images.length}</div>
            )}
          </div>
        </div>
      )}

      {wishlistToast && (
        <div className="wmx-wl-toast">{wishlistToast}</div>
      )}
    </div>
  );
};

export default ProductDetails;