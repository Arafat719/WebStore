import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faStar, faArrowLeft, faGlobe, faDownload,
  faCalendar, faRefresh, faFileLines, faHeadset,
  faTag, faCode, faUser, faAlignLeft, faImage, faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import '../css/ProductsDetails.css';
import ReviewSection from "./Reviewsection";
import userContext from "../context/userContext";
import { Flag } from 'lucide-react';

const REPORT_REASONS = ['Fake product', 'Wrong description', 'Scam / fraud', 'Inappropriate content', 'Other'];

const DEFAULT_LICENSE_TEXT = 'This product is sold under Regular License. You can use it in one personal or client project. Reselling or redistributing is strictly prohibited.';

// ── Folder Tree Viewer ──────────────────────────────────────────
function FileTreeNode({ node, depth = 0 }) {
    const [open, setOpen] = React.useState(depth < 2);
    const isFolder = node.type === "tree";

    if (depth === 0 && node.name === "" && isFolder) {
        return (
            <div className="wmx-tree-node">
                {node.children
                    ?.slice()
                    .sort((a, b) => {
                        if (a.type === b.type) return a.name.localeCompare(b.name);
                        return a.type === "tree" ? -1 : 1;
                    })
                    .map((child, i) => (
                        <FileTreeNode key={i} node={child} depth={0} />
                    ))}
            </div>
        );
    }

    return (
        <div className="wmx-tree-node" style={{ paddingLeft: depth === 0 ? 0 : "1.2rem" }}>
            <div
                className={`wmx-tree-row ${isFolder ? "wmx-tree-folder" : "wmx-tree-file"}`}
                onClick={() => isFolder && setOpen((o) => !o)}
            >
                <span className="wmx-tree-icon">
                    {isFolder ? (open ? "📂" : "📁") : getFileIcon(node.name)}
                </span>
                <span className="wmx-tree-name">{node.name}</span>
                {isFolder && node.children?.length > 0 && (
                    <span className="wmx-tree-count">{node.children.length}</span>
                )}
            </div>
            {isFolder && open && node.children?.length > 0 && (
                <div className="wmx-tree-children">
                    {node.children
                        .slice()
                        .sort((a, b) => {
                            if (a.type === b.type) return a.name.localeCompare(b.name);
                            return a.type === "tree" ? -1 : 1;
                        })
                        .map((child, i) => (
                            <FileTreeNode key={i} node={child} depth={depth + 1} />
                        ))}
                </div>
            )}
        </div>
    );
}

function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const icons = {
        js: "🟨", jsx: "🟨", ts: "🔷", tsx: "🔷",
        json: "📋", md: "📝", css: "🎨", html: "🌐",
        env: "🔒", gitignore: "🔒", png: "🖼️", jpg: "🖼️",
        svg: "🖼️", sh: "⚙️", yml: "⚙️", yaml: "⚙️",
    };
    return icons[ext] || "📄";
}

function RepoTreeSection({ productId }) {
    const [tree, setTree] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [expanded, setExpanded] = React.useState(false);

    const fetchTree = async () => {
        if (tree) { setExpanded((e) => !e); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}/tree`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch file structure");
            setTree(data.tree);
            setExpanded(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wmx-tree-section">
            <button className="wmx-tree-toggle-btn" onClick={fetchTree} disabled={loading}>
                {loading ? "Loading structure..." : expanded ? "▲ Hide File Structure" : "▼ View File Structure"}
            </button>
            {error && <p className="wmx-tree-error">{error}</p>}
            {expanded && tree && (
                <div className="wmx-tree-container">
                    <FileTreeNode node={tree} depth={0} />
                </div>
            )}
        </div>
    );
}
// ────────────────────────────────────────────────────────────────

const LicenseSection = ({ license }) => {
  const [open, setOpen] = useState(true);
  const licenseText = license || DEFAULT_LICENSE_TEXT;
  return (
    <div className="wmx-section wmx-license-section">
      <div className="wmx-license-header" onClick={() => setOpen(o => !o)}>
        <div className="wmx-sec-title" style={{ marginBottom: 0 }}>
          <FontAwesomeIcon icon={faFileLines} />
          License
        </div>
        <span className={`wmx-license-toggle${open ? '' : ' collapsed'}`}>▼</span>
      </div>
      {open && (
        <div className="wmx-license-body">
          {licenseText}
        </div>
      )}
    </div>
  );
};

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
  const [hasPurchased, setHasPurchased] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMsg, setReportMsg] = useState({ text: '', type: '' });
  const { userId, userType } = useContext(userContext);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = userId ? { _id: userId, name: storedUser?.name || "" } : null;
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const images = product?.images ?? [];

  useEffect(() => {
    fetch(`${API}/products/getbyid/${id}`)
      .then(res => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        if (data.error || !data._id) { setNotFound(true); return; }
        setProduct(data);
      })
      .catch(() => setNotFound(true));
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
    const token = localStorage.getItem('token');
    if (!token || !id) return;
    fetch(`${API}/orders`, { headers: { token } })
      .then(res => res.json())
      .then(data => {
        const orders = data.orders || [];
        const purchased = orders.some(
          o => o.product?._id === id && o.status === 'completed'
        );
        setHasPurchased(purchased);
      })
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
    const token = localStorage.getItem("token");
    if (!token) {
      showAlert("Please login to download", "warning");
      navigate("/login");
      return;
    }
    const res = await fetch(
      `${API}/git/download/${githubUsername}/${product?.repoName}`,
      { headers: { token } }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showAlert(err.error || "Download failed.", "error");
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
      headers: { token, "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.error || "Purchase failed", "error");
      return;
    }
    if (data.free) {
      setHasPurchased(true);
      showAlert("Added to your orders! Downloading now...", "success");
      await handleDownload();
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setHasPurchased(true);
    showAlert("Purchase successful! Go to My Orders to download.", "success");
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

  const closeReport = () => {
    setReportOpen(false);
    setReportReason('');
    setReportNote('');
    setReportMsg({ text: '', type: '' });
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setReportLoading(true);
    setReportMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/reports/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({
          productId: product._id,
          productTitle: product.title,
          reason: reportReason,
          message: reportNote,
        }),
      });
      if (res.ok) {
        setReportMsg({ text: 'Report submitted. Thank you for helping keep WebMarketX safe.', type: 'success' });
        setTimeout(closeReport, 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setReportMsg({ text: data.error || 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch {
      setReportMsg({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setReportLoading(false);
    }
  };

  if (notFound) return (
    <div className="wmx-pd-loading">
      <p className="wmx-pd-loading-text">Product not found or no longer available.</p>
      <button className="wmx-back" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
        Go Back
      </button>
    </div>
  );

  if (!product) return (
    <div className="wmx-pd-loading">
      <div className="wmx-pd-spinner" />
      <p className="wmx-pd-loading-text">Loading product...</p>
    </div>
  );

  const isFree = product.price === "Free" || product.price === 0;
  const isOwnProduct = userId && userType === 'seller' && (
    userId === product.sellerId ||
    userId === product.seller?._id ||
    userId === product.sellerId?._id
  );

  return (
    <div className="wmx-pd">

      <div className="wmx-pd-topbar">
        <button className="wmx-back" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}>
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
              <span className="wmx-badge-divider" />
              {product.seller?.profileImage && (
                <img
                  src={product.seller.profilePic}
                  alt={product.seller?.name || 'seller'}
                  className="wmx-badge-avatar"
                />
              )}
              <span className="wmx-badge-by">
                By{' '}
                <Link
                  to={`/seller/${product.seller?._id || product.sellerId?._id || product.sellerId || ''}`}
                  className="wmx-badge-seller-link"
                  onClick={e => e.stopPropagation()}
                >
                  {product.seller?.name || product.sellerName || 'Unknown'}
                </Link>
              </span>
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

          <LicenseSection license={product.license} />

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
                <button className="wmx-buy-btn" onClick={isFree ? (hasPurchased ? handleDownload : handleBuy) : handleBuy}>
                  <FontAwesomeIcon icon={faDownload} />
                  {isFree ? (hasPurchased ? 'Download Free' : 'Get Free') : 'Buy Now'}
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

          <div className="wmx-r-card wmx-r-card--tree">
            <div className="wmx-r-title">
              <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: 6 }} />
              File Structure
            </div>
            <RepoTreeSection productId={product._id} />
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

          {!isOwnProduct && (
            <button className="wmx-report-btn" onClick={() => setReportOpen(true)}>
              <Flag size={12} />
              Report this product
            </button>
          )}

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

      {reportOpen && (
        <div className="wmx-report-modal-overlay" onClick={closeReport}>
          <div className="wmx-report-modal" onClick={e => e.stopPropagation()}>
            <button className="wmx-report-modal-close" onClick={closeReport}>✕</button>
            <h2 className="wmx-report-modal-title">Report this Product</h2>
            <p className="wmx-report-modal-sub">Help us keep WebMarketX safe and trustworthy.</p>
            {!token ? (
              <p className="wmx-report-noauth">Please log in to submit a report.</p>
            ) : (
              <>
                <div className="wmx-report-reason-grid">
                  {REPORT_REASONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      className={`wmx-report-reason-card${reportReason === r ? ' selected' : ''}`}
                      onClick={() => setReportReason(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <textarea
                  className="wmx-report-textarea"
                  placeholder="Describe the issue..."
                  value={reportNote}
                  onChange={e => setReportNote(e.target.value)}
                  rows={3}
                />
                {reportMsg.text && (
                  <p className={`wmx-report-msg wmx-report-msg-${reportMsg.type}`}>{reportMsg.text}</p>
                )}
                <button
                  type="button"
                  className="wmx-report-submit"
                  onClick={handleReport}
                  disabled={reportLoading || !reportReason}
                >
                  {reportLoading ? 'Submitting…' : 'Submit Report'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;