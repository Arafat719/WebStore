import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, ShieldCheck,
  Lock, Heart, ShoppingBag, Settings, LogOut,
  Star, Crown, ChevronRight, Bell, Package,
  TrendingUp, Globe, Edit3, Camera, AtSign,
  Briefcase, GitBranch, Link, Calendar, X
} from "lucide-react";
import userContext from "../context/userContext";
import "../css/ProfilePage.css";
import ReviewSection from "./Reviewsection";
import Productcard from "./Productcard";

const ProfilePage = ({ showAlert }) => {
  const { getProfile, updateProfile, userId } = useContext(userContext);
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
          const res = await fetch(`${import.meta.env.VITE_API_URL}/products/getbyseller/${data.seller._id}`);
          const products = await res.json();
          setSellerProducts(Array.isArray(products) ? products : []);
        } catch {
          setSellerProducts([]);
        } finally {
          setProductsLoading(false);
        }
      }
    };
    load();
  }, []);

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
    { label: "Orders", value: "12", icon: ShoppingBag, color: "#8682fa" },
    { label: "Wishlist", value: "8", icon: Heart, color: "#e05580" },
    { label: "Reviews", value: "24", icon: Star, color: "#f0a500" },
    { label: "Listings", value: "3", icon: Globe, color: "#4caf82" },
  ];

  const infoFields = [
    { label: "Full Name", value: seller?.name, icon: User },
    { label: "Email Address", value: seller?.email, icon: Mail },
    { label: "Phone", value: seller?.phone, icon: Phone },
    { label: "Location", value: seller?.location, icon: MapPin },
    { label: "Website", value: seller?.website, icon: Link },
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

  const recentActivity = [
    { label: "Purchased 'SaaS Starter Kit'", time: "2 days ago", icon: Package, color: "#8682fa" },
    { label: "Left a review on 'Blog Pro'", time: "5 days ago", icon: Star, color: "#f0a500" },
    { label: "Added 'E-Commerce Bundle' to wishlist", time: "1 week ago", icon: Heart, color: "#e05580" },
    { label: "Listed 'Portfolio Template'", time: "2 weeks ago", icon: TrendingUp, color: "#4caf82" },
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
          {seller?.isPremium ? "Premium Seller" : "Seller"} · WebMarketX
        </div>

        <div className="wmx-sb-stats">
          <div className="wmx-sb-stat"><span>12</span>Orders</div>
          <div className="wmx-sb-stat-div" />
          <div className="wmx-sb-stat"><span>8</span>Wishlist</div>
          <div className="wmx-sb-stat-div" />
          <div className="wmx-sb-stat"><span>3</span>Listed</div>
        </div>

        <div className="wmx-sb-divider" />

        <nav className="wmx-sb-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`wmx-sb-btn ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
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

        {/* Hero banner */}
        <div className="wmx-hero">
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
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="wmx-hero-stat">
                  <div className="wmx-hero-stat-icon" style={{ color, background: `${color}18` }}>
                    <Icon size={14} />
                  </div>
                  <div className="wmx-hero-stat-num">{value}</div>
                  <div className="wmx-hero-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

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

        {/* Content grid */}
        <div className="wmx-pg-grid" style={{ display: activeTab === "reviews" ? "none" : undefined }}>

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
                    <div>
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

              <div className="wmx-activity-list">
                {recentActivity.map(({ label, time, icon: Icon, color }, i) => (
                  <div key={i} className="wmx-activity-item">
                    <div className="wmx-activity-icon" style={{ color, background: `${color}18` }}>
                      <Icon size={13} />
                    </div>
                    <div className="wmx-activity-text">
                      <div className="wmx-activity-label">{label}</div>
                      <div className="wmx-activity-time">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
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
              <button className="wmx-premium-btn">
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
                  { label: "Browse Marketplace", icon: Globe },
                  { label: "Add New Listing", icon: Package },
                  { label: "View Wishlist", icon: Heart },
                ].map(({ label, icon: Icon }) => (
                  <button key={label} className="wmx-ql-btn">
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
        <div className="wmx-sp-section" style={{ display: activeTab === "reviews" ? "none" : undefined }}>
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
                <Productcard key={product._id} arr={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Edit Modal ── */}
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
