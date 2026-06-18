import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, ShieldCheck,
  Lock, Heart, ShoppingBag, Settings, LogOut,
  Star, Crown, ChevronRight, Bell, Package,
  TrendingUp, Globe, Edit3, Camera, AtSign,
  Briefcase, GitBranch, Link as LinkIcon, Calendar, X, Trash2, Pencil
} from "lucide-react";
import userContext from "../context/userContext";
import "../css/ProfilePage.css";
import ReviewSection from "./Reviewsection";
import Productcard from "./Productcard";
import MyOrders from "../pages/MyOrders/MyOrders";
import EditProductModal from "./EditProductModal";

const ProfilePage = ({ showAlert }) => {
  const { getProfile, updateProfile, userId, userType } = useContext(userContext);
  const [seller, setSeller] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "", phone: "", location: "", bio: "", website: "", profileImage: "",
    social: { twitter: "", linkedin: "", github: "" }
  });
  const [sellerProducts, setSellerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistFetched, setWishlistFetched] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [orderCount, setOrderCount] = useState('—');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getProfile();
      if (data?.success) {
        setSeller(data.seller);
        setEditForm({
          name: data.seller.name || "",
          phone: data.seller.phone || "",
          location: data.seller.location || "",
          bio: data.seller.bio || "",
          website: data.seller.website || "",
          profileImage: data.seller.profileImage || "",
          social: {
            twitter: data.seller.social?.twitter || "",
            linkedin: data.seller.social?.linkedin || "",
            github: data.seller.social?.github || "",
          }
        });
        setProductsLoading(true);
        try {
          const [productsRes, reviewsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/products/getbyseller/${data.seller._id}`),
            fetch(`${import.meta.env.VITE_API_URL}/reviews/seller/${data.seller._id}`),
          ]);
          const products = await productsRes.json();
          const reviews = await reviewsRes.json();
          setSellerProducts(Array.isArray(products) ? products : []);
          setReviewStats({
            totalReviews: reviews.totalReviews || 0,
            averageRating: reviews.averageRating || 0,
          });
        } catch {
          setSellerProducts([]);
        } finally {
          setProductsLoading(false);
        }
        const token = localStorage.getItem('token');
        if (token) {
          fetch(`${import.meta.env.VITE_API_URL}/wishlist/my`, { headers: { token } })
            .then(r => r.json())
            .then(d => setWishlistCount(Array.isArray(d) ? d.length : 0))
            .catch(() => {});
          fetch(`${import.meta.env.VITE_API_URL}/orders`, { headers: { token } })
            .then(r => r.json())
            .then(d => setOrderCount(Array.isArray(d.orders) ? String(d.orders.length) : '—'))
            .catch(() => {});
        }
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab !== 'wishlist') {
      setWishlistFetched(false);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setWishlistFetched(true);
      return;
    }
    setWishlistLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/wishlist/my`, { headers: { "token": token } })
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : [];
        setWishlistItems(items);
        setWishlistCount(items.length);
      })
      .catch(() => {})
      .finally(() => {
        setWishlistLoading(false);
        setWishlistFetched(true);
      });
  }, [activeTab]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/delete/${deleteTarget}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', token },
      });
      if (res.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      if (res.ok) {
        setSellerProducts(prev => prev.filter(p => p._id !== deleteTarget));
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        setDeleteError(data.message || data.error || 'Failed to delete product');
      }
    } catch {
      setDeleteError('Server error. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    let res = null;
    try {
      res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { token },
      });
    } catch {}
    if (res?.ok) {
      setRemovingIds(prev => new Set([...prev, productId]));
      setTimeout(() => {
        setWishlistItems(prev => prev.filter(item => {
          const p = item.product || item;
          return p._id !== productId;
        }));
        setWishlistCount(prev => Math.max(0, prev - 1));
        setRemovingIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
      }, 300);
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setSellerProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    setEditingProduct(null);
    setSuccessToast('Product updated successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    navigate("/login");
  };

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setEditForm(f => ({ ...f, profileImage: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = await updateProfile(editForm);
    setSaving(false);
    if (data?.success) {
      setSeller(data.seller);
      setEditOpen(false);
    }
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setEditForm(f => ({ ...f, social: { ...f.social, [key]: value } }));
    } else {
      setEditForm(f => ({ ...f, [name]: value }));
    }
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Listings", value: String(sellerProducts.length), icon: Globe, color: "#4caf82" },
    { label: "Reviews", value: String(reviewStats.totalReviews), icon: Star, color: "#f0a500" },
    { label: "Orders", value: orderCount, icon: ShoppingBag, color: "#8682fa" },
    { label: "Wishlist", value: String(wishlistCount), icon: Heart, color: "#e05580" },
  ];

  const infoFields = [
    { label: "Full Name", value: seller?.name, icon: User },
    { label: "Email Address", value: seller?.email, icon: Mail },
    { label: "Phone", value: seller?.phone, icon: Phone },
    { label: "Location", value: seller?.location, icon: MapPin },
    { label: "Website", value: seller?.website, icon: LinkIcon },
    { label: "Joined", value: seller?.joinedAt ? new Date(seller.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : undefined, icon: Calendar },
  ];

  const socialLinks = [
    { label: "Twitter", value: seller?.social?.twitter, icon: AtSign, color: "#1da1f2" },
    { label: "LinkedIn", value: seller?.social?.linkedin, icon: Briefcase, color: "#0a66c2" },
    { label: "GitHub", value: seller?.social?.github, icon: GitBranch, color: "#c0c0e0" },
  ];

  const securityItems = [
    { label: "Email Verified", active: seller?.isVerified ?? false, icon: Mail },
    { label: "Premium Account", active: seller?.isPremium ?? false, icon: Crown },
    { label: "2FA Enabled", active: false, icon: Lock },
  ];


  return (
    <div className="wmx-prof">

      {/* ── Sidebar ── */}
      <aside className="wmx-sidebar">
        <div className="wmx-sb-avatar-wrap">
          {seller?.profileImage
            ? <img src={seller.profileImage} alt="avatar" className="wmx-sb-avatar" style={{ objectFit: "cover" }} />
            : <div className="wmx-sb-avatar">{seller?.name?.[0] ?? "U"}</div>
          }
          <button className="wmx-sb-avatar-edit" onClick={() => setEditOpen(true)}><Camera size={12} /></button>
        </div>

        <div className="wmx-sb-name">{seller?.name ?? "User"}</div>
        <div className="wmx-sb-role">
          <span className="wmx-sb-dot" />
          {seller?.isPremium ? "Premium Seller" : (userType === "seller" ? "Seller" : "Buyer")} · WebMarketX
        </div>

        <div className="wmx-sb-stats">
          <div className="wmx-sb-stat"><span>{sellerProducts.length}</span>Listed</div>
          <div className="wmx-sb-stat-div" />
          <div className="wmx-sb-stat"><span>{reviewStats.totalReviews}</span>Reviews</div>
          <div className="wmx-sb-stat-div" />
          <div className="wmx-sb-stat"><span>{reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : "—"}</span>Rating</div>
        </div>

        <div className="wmx-sb-divider" />

        <nav className="wmx-sb-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`wmx-sb-btn ${activeTab === id ? "active" : ""}`}
              onClick={() => id === "settings" ? navigate("/settings") : setActiveTab(id)}
            >
              <span className="wmx-sb-btn-icon"><Icon size={15} /></span>
              {label}
              {activeTab === id && <span className="wmx-sb-btn-dot" />}
            </button>
          ))}
        </nav>

        <button className="wmx-sb-logout" onClick={handleLogout}>
          <LogOut size={14} />
          Sign Out
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="wmx-prof-main">

        {/* Hero banner — hidden on orders tab */}
        {activeTab !== "orders" && <div className="wmx-hero">
          <div className="wmx-hero-orb wmx-hero-orb-1" />
          <div className="wmx-hero-orb wmx-hero-orb-2" />

          <div className="wmx-hero-inner">
            <div className="wmx-hero-left">
              <div className="wmx-hero-avatar">
                {seller?.profileImage
                  ? <img src={seller.profileImage} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "20px", objectFit: "cover" }} />
                  : seller?.name?.[0] ?? "U"
                }
              </div>
              <div className="wmx-hero-info">
                <div className="wmx-hero-eyebrow">
                  <span className="wmx-hero-pulse" />
                  Active Seller
                </div>
                <h2 className="wmx-hero-name">
                  {seller?.name?.split(" ")[0] ?? "there"} 👋
                </h2>
                <p className="wmx-hero-sub">
                  {seller?.bio || "Manage your profile and activity"}
                </p>
                <div className="wmx-hero-tags">
                  {seller?.location && (
                    <span className="wmx-hero-tag"><MapPin size={10} /> {seller.location}</span>
                  )}
                  {seller?.isVerified && (
                    <span className="wmx-hero-tag verified"><ShieldCheck size={10} /> Verified</span>
                  )}
                  {seller?.isPremium && (
                    <span className="wmx-hero-tag" style={{ color: "#f0c060", background: "rgba(240,192,96,0.08)", borderColor: "rgba(240,192,96,0.2)" }}>
                      <Crown size={10} /> Premium
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="wmx-hero-stats">
              {stats.map(({ label, value, icon: Icon, color, soon }) => (
                <div key={label} className="wmx-hero-stat">
                  <div className="wmx-hero-stat-icon" style={{ color, background: `${color}18` }}>
                    <Icon size={14} />
                  </div>
                  <div className="wmx-hero-stat-num">{value}</div>
                  <div className="wmx-hero-stat-label">
                    {label}
                    {soon && <span style={{ fontSize: "0.55rem", color: "#8682fa", marginLeft: 4, opacity: 0.7 }}>soon</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* Orders tab */}
        {activeTab === "orders" && <MyOrders />}

        {/* Reviews tab */}
        {activeTab === "reviews" && seller?._id && (
          <div style={{ padding: "0 2rem 3rem" }}>
            <ReviewSection
              sellerId={seller._id}
              currentUser={userId ? { _id: userId, name: seller?.name || "" } : null}
              showAlert={showAlert}
            />
          </div>
        )}

        {/* Wishlist tab */}
        {activeTab === "wishlist" && (
          <div className="wmx-wl-section">
            <div className="wmx-sp-header">
              <div className="wmx-card-icon-wrap"><Heart size={14} /></div>
              <span>My Wishlist</span>
            </div>
            {(!wishlistFetched || wishlistLoading) ? (
              <div className="wmx-wl-grid">
                {[1, 2, 3].map(i => (
                  <div key={i} className="wmx-wl-skeleton">
                    <div className="wmx-wl-sk-img" />
                    <div className="wmx-wl-sk-body">
                      <div className="wmx-wl-sk-line wmx-wl-sk-title" />
                      <div className="wmx-wl-sk-line wmx-wl-sk-price" />
                      <div className="wmx-wl-sk-line wmx-wl-sk-btn" />
                    </div>
                  </div>
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="wmx-wl-empty">
                <div className="wmx-wl-empty-icon">♡</div>
                <p>No products in your wishlist yet</p>
                <button className="wmx-wl-browse-btn" onClick={() => navigate('/')}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="wmx-wl-grid">
                {wishlistItems.map(item => {
                  const prod = item.productId || item.product || item;
                  const productId = prod._id || item._id;
                  const isRemoving = removingIds.has(productId);
                  return (
                    <div key={productId} className={`wmx-wl-card${isRemoving ? ' removing' : ''}`}>
                      <button
                        className="wmx-wl-remove-btn"
                        onClick={() => handleRemoveWishlist(productId)}
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                      <div className="wmx-wl-card-img">
                        {prod.images?.[0]
                          ? <img src={prod.images[0]} alt={prod.title} />
                          : <div className="wmx-wl-card-img-placeholder">No Image</div>
                        }
                      </div>
                      <div className="wmx-wl-card-body">
                        <h4 className="wmx-wl-card-title">{prod.title}</h4>
                        <div className="wmx-wl-card-price">
                          {prod.price === 'Free' || prod.price === 0 ? 'Free' : `$${prod.price}`}
                        </div>
                        <div className="wmx-wl-card-btns">
                          <Link to={`/products/${productId}`} className="wmx-wl-view-btn">
                            View Product
                          </Link>
                          <Link to={`/products/${productId}`} className="wmx-wl-buy-btn">
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Content grid */}
        <div className="wmx-pg-grid" style={{ display: (activeTab === "reviews" || activeTab === "orders" || activeTab === "wishlist") ? "none" : undefined }}>

          {/* ── Left column ── */}
          <div className="wmx-pg-left">

            {/* User Info */}
            <div className="wmx-card">
              <div className="wmx-card-hd">
                <div className="wmx-card-hd-left">
                  <div className="wmx-card-icon-wrap"><User size={14} /></div>
                  <span>Seller Information</span>
                </div>
                <button className="wmx-edit-btn" onClick={() => setEditOpen(true)}>
                  <Edit3 size={12} /> Edit
                </button>
              </div>

              <div className="wmx-info-grid">
                {infoFields.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="wmx-info-item">
                    <div className="wmx-info-icon"><Icon size={15} /></div>
                    <div className="wmx-info-text">
                      <div className="wmx-info-label">{label}</div>
                      <div className="wmx-info-value">{value ?? "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="wmx-card">
              <div className="wmx-card-hd">
                <div className="wmx-card-hd-left">
                  <div className="wmx-card-icon-wrap"><Globe size={14} /></div>
                  <span>Social Links</span>
                </div>
              </div>
              <div className="wmx-activity-list">
                {socialLinks.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="wmx-activity-item">
                    <div className="wmx-activity-icon" style={{ color, background: `${color}18` }}>
                      <Icon size={13} />
                    </div>
                    <div className="wmx-activity-text">
                      <div className="wmx-activity-label">{label}</div>
                      <div className="wmx-activity-time">
                        {value
                          ? <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#8682fa", textDecoration: "none" }}>{value}</a>
                          : "—"
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="wmx-card">
              <div className="wmx-card-hd">
                <div className="wmx-card-hd-left">
                  <div className="wmx-card-icon-wrap"><Bell size={14} /></div>
                  <span>Recent Activity</span>
                </div>
              </div>

              <div className="wmx-empty">No recent activity yet.</div>
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="wmx-pg-right">

            {/* Security */}
            <div className="wmx-card">
              <div className="wmx-card-hd">
                <div className="wmx-card-hd-left">
                  <div className="wmx-card-icon-wrap"><Lock size={14} /></div>
                  <span>Account Status</span>
                </div>
              </div>

              <div className="wmx-sec-list">
                {securityItems.map(({ label, active, icon: Icon }) => (
                  <div key={label} className="wmx-sec-item">
                    <div className="wmx-sec-left">
                      <Icon size={13} color="#8682fa" />
                      {label}
                    </div>
                    <span className={`wmx-sec-badge ${active ? "on" : "off"}`}>
                      {active ? "Active" : "Off"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div className="wmx-premium">
              <div className="wmx-premium-orb" />
              <div className="wmx-premium-top">
                <Crown size={16} color="#f0c060" />
                <span className="wmx-premium-eyebrow">Upgrade</span>
              </div>
              <h3 className="wmx-premium-title">Go Premium</h3>
              <p className="wmx-premium-sub">
                Priority listings, analytics dashboard, featured badge & more.
              </p>
              <ul className="wmx-premium-perks">
                <li><span>✦</span> Featured listing placement</li>
                <li><span>✦</span> Advanced analytics</li>
                <li><span>✦</span> Verified seller badge</li>
              </ul>
              <button className="wmx-premium-btn" onClick={() => { setSuccessToast('Premium plan coming soon! 🚀'); setTimeout(() => setSuccessToast(''), 3500); }}>
                Upgrade Now <ChevronRight size={13} />
              </button>
            </div>

            {/* Quick links */}
            <div className="wmx-card wmx-quicklinks">
              <div className="wmx-card-hd">
                <div className="wmx-card-hd-left">
                  <div className="wmx-card-icon-wrap"><TrendingUp size={14} /></div>
                  <span>Quick Actions</span>
                </div>
              </div>
              <div className="wmx-ql-list">
                {[
                  { label: "Browse Marketplace", icon: Globe, action: () => navigate('/') },
                  ...(userType === "seller" ? [{ label: "Add New Listing", icon: Package, action: () => navigate('/addproducts') }] : []),
                  { label: "View Wishlist", icon: Heart, action: () => setActiveTab('wishlist') },
                ].map(({ label, icon: Icon, action }) => (
                  <button key={label} className="wmx-ql-btn" onClick={action}>
                    <Icon size={13} />
                    {label}
                    <ChevronRight size={12} className="wmx-ql-arrow" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── My Listings ── */}
        <div className="wmx-sp-section" style={{ display: (activeTab === "reviews" || activeTab === "orders" || activeTab === "wishlist") ? "none" : undefined }}>
          <div className="wmx-sp-header">
            <div className="wmx-card-icon-wrap"><Package size={14} /></div>
            <span>My Listings</span>
          </div>
          {productsLoading ? (
            <div className="wmx-empty">Loading products…</div>
          ) : sellerProducts.length === 0 ? (
            <div className="wmx-empty">No products listed yet.</div>
          ) : (
            <div className="wmx-sp-grid">
              {sellerProducts.map((product) => (
                <div key={product._id} className="wmx-sp-card-wrap">
                  <div className="wmx-sp-card-actions">
                    <button
                      className="wmx-sp-action-btn wmx-edit"
                      title="Edit product"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="wmx-sp-action-btn wmx-del"
                      title="Delete product"
                      onClick={() => { setDeleteTarget(product._id); setDeleteError(''); }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <Productcard arr={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Delete Confirm Dialog ── */}
      {deleteTarget && (
        <div
          className="wmx-modal-overlay"
          onClick={e => e.target === e.currentTarget && !deleteLoading && setDeleteTarget(null)}
        >
          <div className="wmx-delete-dialog">
            <div className="wmx-delete-icon">🗑️</div>
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            {deleteError && <div className="wmx-modal-error" style={{ marginBottom: 16 }}>{deleteError}</div>}
            <div className="wmx-delete-dialog-btns">
              <button
                className="wmx-modal-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="wmx-delete-confirm-btn"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Product Modal ── */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}

      {/* ── Success Toast ── */}
      {successToast && (
        <div className="wmx-toast">
          <span>✓</span> {successToast}
        </div>
      )}

      {/* ── Profile Edit Modal ── */}
      {editOpen && (
        <div className="wmx-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="wmx-modal">
            <div className="wmx-modal-hd">
              <span>Edit Profile</span>
              <button className="wmx-modal-close" onClick={() => setEditOpen(false)}><X size={16} /></button>
            </div>

            <div className="wmx-modal-body">
              <div className="wmx-modal-row">
                <div className="wmx-modal-field">
                  <label>Name</label>
                  <input name="name" value={editForm.name} onChange={onEditChange} placeholder="Your name" />
                </div>
                <div className="wmx-modal-field">
                  <label>Phone</label>
                  <input name="phone" value={editForm.phone} onChange={onEditChange} placeholder="+1 234 567 890" />
                </div>
              </div>

              <div className="wmx-modal-row">
                <div className="wmx-modal-field">
                  <label>Location</label>
                  <input name="location" value={editForm.location} onChange={onEditChange} placeholder="City, Country" />
                </div>
                <div className="wmx-modal-field">
                  <label>Website</label>
                  <input name="website" value={editForm.website} onChange={onEditChange} placeholder="https://yoursite.com" />
                </div>
              </div>

              <div className="wmx-modal-field">
                <label>Profile Image</label>
                <div
                  className={`wmx-img-drop${dragOver ? " drag-over" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {editForm.profileImage ? (
                    <>
                      <img src={editForm.profileImage} alt="preview" className="wmx-img-drop-preview" />
                      <button
                        className="wmx-img-drop-remove"
                        onClick={(e) => { e.stopPropagation(); setEditForm(f => ({ ...f, profileImage: "" })); }}
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="wmx-img-drop-placeholder">
                      <Camera size={22} />
                      <span>Click or drag image here</span>
                      <span className="wmx-img-drop-sub">PNG, JPG, WEBP</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="wmx-modal-field">
                <label>Bio <span style={{ color: "#3e3e52", fontSize: "0.7rem" }}>({editForm.bio.length}/300)</span></label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={onEditChange}
                  maxLength={300}
                  rows={3}
                  placeholder="Tell buyers about yourself..."
                />
              </div>

              <div className="wmx-modal-section-title">Social Links</div>
              <div className="wmx-modal-row">
                <div className="wmx-modal-field">
                  <label><AtSign size={11} /> Twitter</label>
                  <input name="social.twitter" value={editForm.social.twitter} onChange={onEditChange} placeholder="https://twitter.com/..." />
                </div>
                <div className="wmx-modal-field">
                  <label><Briefcase size={11} /> LinkedIn</label>
                  <input name="social.linkedin" value={editForm.social.linkedin} onChange={onEditChange} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="wmx-modal-field">
                <label><GitBranch size={11} /> GitHub</label>
                <input name="social.github" value={editForm.social.github} onChange={onEditChange} placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="wmx-modal-ft">
              <button className="wmx-modal-cancel" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="wmx-modal-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
