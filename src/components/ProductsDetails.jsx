import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faStar, faArrowLeft, faGlobe, faDownload,
  faCalendar, faRefresh, faFileLines, faHeadset,
  faTag, faCode, faUser, faAlignLeft, faImage, faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
                    {isFolder ? (
                      open ? (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                          <path d="M2 6a2 2 0 012-2h4.586A2 2 0 0110 4.586L11.414 6H20a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#f5a623"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                          <path d="M2 6a2 2 0 012-2h4.586A2 2 0 0110 4.586L11.414 6H20a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#f5a623" opacity="0.7"/>
                        </svg>
                      )
                    ) : (
                      <span className="wmx-tree-file-icon">{getFileIcon(node.name)}</span>
                    )}
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

  const svgIcons = {
    js:        <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#f7df1e"/><text x="6" y="24" fontSize="16" fontWeight="bold" fill="#000">JS</text></svg>,
    jsx:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#61dafb"/><text x="5" y="24" fontSize="14" fontWeight="bold" fill="#000">JSX</text></svg>,
    ts:        <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#3178c6"/><text x="7" y="24" fontSize="16" fontWeight="bold" fill="#fff">TS</text></svg>,
    tsx:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#3178c6"/><text x="3" y="24" fontSize="14" fontWeight="bold" fill="#fff">TSX</text></svg>,
    json:      <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#f5a623"/><text x="1" y="24" fontSize="13" fontWeight="bold" fill="#fff">JSON</text></svg>,
    md:        <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#4a90d9"/><text x="5" y="24" fontSize="14" fontWeight="bold" fill="#fff">MD</text></svg>,
    css:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#264de4"/><text x="3" y="24" fontSize="14" fontWeight="bold" fill="#fff">CSS</text></svg>,
    html:      <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#e44d26"/><text x="1" y="24" fontSize="12" fontWeight="bold" fill="#fff">HTML</text></svg>,
    env:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#4caf50"/><text x="2" y="24" fontSize="13" fontWeight="bold" fill="#fff">ENV</text></svg>,
    gitignore: <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#f05032"/><text x="8" y="24" fontSize="14" fontWeight="bold" fill="#fff">GI</text></svg>,
    png:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#9c27b0"/><text x="2" y="24" fontSize="13" fontWeight="bold" fill="#fff">IMG</text></svg>,
    jpg:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#9c27b0"/><text x="2" y="24" fontSize="13" fontWeight="bold" fill="#fff">IMG</text></svg>,
    svg:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#ff9800"/><text x="2" y="24" fontSize="13" fontWeight="bold" fill="#fff">SVG</text></svg>,
    sh:        <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#212121"/><text x="7" y="24" fontSize="14" fontWeight="bold" fill="#4caf50">SH</text></svg>,
    yml:       <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#cc1018"/><text x="1" y="24" fontSize="12" fontWeight="bold" fill="#fff">YAML</text></svg>,
    yaml:      <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#cc1018"/><text x="1" y="24" fontSize="12" fontWeight="bold" fill="#fff">YAML</text></svg>,
    lock:      <svg viewBox="0 0 32 32" width="14" height="14"><rect width="32" height="32" rx="4" fill="#607d8b"/><text x="2" y="24" fontSize="11" fontWeight="bold" fill="#fff">LOCK</text></svg>,
  };

  if (svgIcons[ext]) return svgIcons[ext];

  return (
    <svg viewBox="0 0 32 32" width="14" height="14">
      <rect width="32" height="32" rx="4" fill="#546e7a"/>
      <text x="6" y="24" fontSize="14" fontWeight="bold" fill="#fff">F</text>
    </svg>
  );
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/tree`);
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
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ buyerName: "", buyerEmail: "", message: "" });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customSuccess, setCustomSuccess] = useState(false);
  const [customError, setCustomError] = useState("");
  const [sellerWhatsapp, setSellerWhatsapp] = useState("");
  const { userId, userRoles } = useContext(userContext);
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
    const sellerId = product?.seller?._id || product?.seller || product?.sellerId?._id || product?.sellerId || product?.user;
    if (!sellerId || typeof sellerId !== 'string') return;
    fetch(`${API}/seller/public/${sellerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setSellerWhatsapp(data.whatsapp);
      })
      .catch(() => {});
  }, [product?.seller, product?.sellerId, product?.user]);

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

  const handleCustomSubmit = async () => {
    setCustomError("");
    if (!customForm.buyerName.trim() || !customForm.buyerEmail.trim() || !customForm.message.trim()) {
      setCustomError("All fields are required.");
      return;
    }
    setCustomSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/custom-request/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          buyerName: customForm.buyerName,
          buyerEmail: customForm.buyerEmail,
          message: customForm.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomSuccess(true);
      } else {
        setCustomError(data.error || "Something went wrong.");
      }
    } catch {
      setCustomError("Server error. Please try again.");
    } finally {
      setCustomSubmitting(false);
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
  const isOwnProduct = userId && userRoles?.includes('seller') && (
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
              {product.seller?.profilePic && (
                <img
                  src={product.seller.profilePic}
                  alt={product.seller?.name || 'seller'}
                  className="wmx-badge-avatar"
                />
              )}
              {(product.seller?.name || product.sellerName) && (
                <span className="wmx-badge-by">
                  By{' '}
                  <Link
                    to={`/seller/${product.seller?._id || product.sellerId?._id || product.sellerId || ''}`}
                    className="wmx-badge-seller-link"
                    onClick={e => e.stopPropagation()}
                  >
                    {product.seller?.name || product.sellerName}
                  </Link>
                </span>
              )}
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
            <button
              className="wmx-custom-request-btn"
              onClick={() => {
                setCustomModalOpen(true);
                setCustomSuccess(false);
                setCustomError("");
                setCustomForm({ buyerName: "", buyerEmail: "", message: "" });
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Request Customization
            </button>
            {!isOwnProduct && (
              product.whatsappNumber ? (
                <a
                  href={`https://wa.me/${product.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wmx-whatsapp-btn"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  Contact Seller on WhatsApp
                </a>
              ) : sellerWhatsapp && (
                <a
                  href={`https://wa.me/${sellerWhatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wmx-whatsapp-btn"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  Chat on WhatsApp
                </a>
              )
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

      {customModalOpen && (
        <div
          className="wmx-custom-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && !customSubmitting && setCustomModalOpen(false)}
        >
          <div className="wmx-custom-modal">
            <div className="wmx-custom-modal-hd">
              <span>Request Customization</span>
              <button
                className="wmx-custom-modal-close"
                onClick={() => !customSubmitting && setCustomModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {customSuccess ? (
              <div className="wmx-custom-modal-success">
                <div className="wmx-custom-success-icon">✓</div>
                <h4>Request Sent!</h4>
                <p>The seller has been notified. They will reply to your email within 30 minutes. If they don't respond in time, the WebMarketX team will contact you directly.</p>
                <button
                  className="wmx-custom-done-btn"
                  onClick={() => setCustomModalOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="wmx-custom-modal-body">
                <p className="wmx-custom-modal-subtitle">
                  Describe what you want customized. The seller will contact you within <strong>30 minutes</strong> — if they don't, WebMarketX team steps in.
                </p>

                <div className="wmx-custom-field">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={customForm.buyerName}
                    onChange={(e) => setCustomForm(f => ({ ...f, buyerName: e.target.value }))}
                    disabled={customSubmitting}
                  />
                </div>

                <div className="wmx-custom-field">
                  <label>Your Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={customForm.buyerEmail}
                    onChange={(e) => setCustomForm(f => ({ ...f, buyerEmail: e.target.value }))}
                    disabled={customSubmitting}
                  />
                </div>

                <div className="wmx-custom-field">
                  <label>What do you need customized?</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the changes you want — colors, content, features, branding..."
                    value={customForm.message}
                    onChange={(e) => setCustomForm(f => ({ ...f, message: e.target.value }))}
                    disabled={customSubmitting}
                  />
                </div>

                {customError && (
                  <div className="wmx-custom-error">{customError}</div>
                )}

                <div className="wmx-custom-modal-ft">
                  <button
                    className="wmx-custom-cancel-btn"
                    onClick={() => setCustomModalOpen(false)}
                    disabled={customSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="wmx-custom-submit-btn"
                    onClick={handleCustomSubmit}
                    disabled={customSubmitting}
                  >
                    {customSubmitting ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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