import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBuilding, faCircleCheck, faRocket } from '@fortawesome/free-solid-svg-icons';
import { X } from "lucide-react";
import userContext from "../../context/userContext";
import SmartOrderCard from "../../components/SmartOrderCard/SmartOrderCard";
import "./SmartOrder.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ORDER_TYPES = [
  {
    key: "web_product",
    label: "For Web Product",
    desc: "Customize or develop an existing web product",
    icon: faCartShopping,
  },
  {
    key: "own_business",
    label: "For Own Business",
    desc: "Build a new website or app for your own business",
    icon: faBuilding,
  },
];

const SITE_TYPES = [
  "E-commerce",
  "Portfolio",
  "SaaS / Web App",
  "Blog / News",
  "Landing Page",
  "Job Board",
  "Directory / Listing",
  "Other",
];

export default function SmartOrder() {
  const { userRoles } = useContext(userContext);
  const isSeller = userRoles?.includes("seller");

  const [activeTab, setActiveTab] = useState("place");

  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState("");
  const [form, setForm] = useState({
    siteType: "",
    features: "",
    budget: "",
    deadline: "",
    referenceLink: "",
    notes: "",
  });
  const [uiFile, setUiFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [submitted, setSubmitted] = useState(false);

  // Browse Orders (seller)
  const [browseOrders, setBrowseOrders] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browsePage, setBrowsePage] = useState(1);
  const [browseTotalPages, setBrowseTotalPages] = useState(1);
  const [proposedIds, setProposedIds] = useState(new Set());

  // My Requests (buyer)
  const [mineOrders, setMineOrders] = useState([]);
  const [mineLoading, setMineLoading] = useState(false);

  // Send Proposal modal
  const [proposalTarget, setProposalTarget] = useState(null);
  const [proposalForm, setProposalForm] = useState({ price: "", timeline: "", message: "" });
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalStatusMsg, setProposalStatusMsg] = useState({ type: "", text: "" });

  // View Proposals modal
  const [proposalsTarget, setProposalsTarget] = useState(null);
  const [proposalsList, setProposalsList] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [confirmingProposalId, setConfirmingProposalId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    if (activeTab !== "browse") return;
    setBrowseLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/smartorder/browse?page=${browsePage}`, { headers: { token } })
      .then((r) => r.json())
      .then((data) => {
        setBrowseOrders(data.orders || []);
        setBrowseTotalPages(data.totalPages || 1);
      })
      .catch(() => setBrowseOrders([]))
      .finally(() => setBrowseLoading(false));
  }, [activeTab, browsePage]);

  useEffect(() => {
    if (activeTab !== "mine") return;
    setMineLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/smartorder/mine`, { headers: { token } })
      .then((r) => r.json())
      .then((data) => setMineOrders(data.orders || []))
      .catch(() => setMineOrders([]))
      .finally(() => setMineLoading(false));
  }, [activeTab]);

  const openProposalModal = (order) => {
    setProposalTarget(order);
    setProposalForm({ price: "", timeline: "", message: "" });
    setProposalStatusMsg({ type: "", text: "" });
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!proposalForm.price || isNaN(proposalForm.price) || Number(proposalForm.price) <= 0) {
      setProposalStatusMsg({ type: "error", text: "Please enter a valid price." });
      return;
    }
    if (!proposalForm.timeline.trim()) {
      setProposalStatusMsg({ type: "error", text: "Please enter a timeline." });
      return;
    }
    setProposalSubmitting(true);
    setProposalStatusMsg({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/smartorder/${proposalTarget._id}/proposals`, {
        method: "POST",
        headers: { token, "Content-Type": "application/json" },
        body: JSON.stringify(proposalForm),
      });
      const data = await res.json();
      if (data.success) {
        setProposedIds((prev) => new Set(prev).add(proposalTarget._id));
        setProposalTarget(null);
      } else {
        setProposalStatusMsg({ type: "error", text: data.message || "Failed to send proposal." });
      }
    } catch {
      setProposalStatusMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setProposalSubmitting(false);
    }
  };

  const openProposalsModal = (order) => {
    setProposalsTarget(order);
    setProposalsList([]);
    setProposalsLoading(true);
    setConfirmingProposalId(null);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/smartorder/${order._id}/proposals`, { headers: { token } })
      .then((r) => r.json())
      .then((data) => setProposalsList(data.proposals || []))
      .catch(() => setProposalsList([]))
      .finally(() => setProposalsLoading(false));
  };

  const acceptProposal = async (proposalId) => {
    setAcceptingId(proposalId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/smartorder/${proposalsTarget._id}/proposals/${proposalId}/accept`,
        { method: "PUT", headers: { token } }
      );
      const data = await res.json();
      if (data.success) {
        setProposalsList((prev) =>
          prev.map((p) => ({ ...p, status: p._id === proposalId ? "accepted" : "rejected" }))
        );
        setMineOrders((prev) =>
          prev.map((o) => (o._id === proposalsTarget._id ? { ...o, status: "in_progress" } : o))
        );
      }
    } catch {
      // no-op — user can retry
    } finally {
      setAcceptingId(null);
      setConfirmingProposalId(null);
    }
  };

  const handleTypeSelect = (key) => {
    setOrderType(key);
    setStep(2);
    setStatusMsg({ type: "", text: "" });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setFileError("Only JPG, PNG, WEBP, or PDF files are allowed.");
      setUiFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be under 10MB.");
      setUiFile(null);
      return;
    }
    setFileError("");
    setUiFile(file);
  };

  const validate = () => {
    if (!form.siteType) return "Please select a site type.";
    if (!form.budget || isNaN(form.budget) || Number(form.budget) <= 0)
      return "Please enter a valid budget (USD).";
    if (!form.deadline) return "Please select a deadline.";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.deadline) < today) return "Deadline cannot be in the past.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });
    const error = validate();
    if (error) {
      setStatusMsg({ type: "error", text: error });
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatusMsg({ type: "error", text: "Please log in to place an order." });
        setSubmitting(false);
        return;
      }
      const featuresArray = form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("orderType", orderType);
      formData.append("siteType", form.siteType);
      formData.append("features", JSON.stringify(featuresArray));
      formData.append("budget", form.budget);
      formData.append("deadline", form.deadline);
      formData.append("referenceLink", form.referenceLink);
      formData.append("notes", form.notes);
      if (uiFile) formData.append("uiFile", uiFile);

      const res = await fetch(`${API_BASE}/smartorder/create`, {
        method: "POST",
        headers: { token },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setStatusMsg({ type: "error", text: data.message || "Failed to place order. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setOrderType("");
    setForm({ siteType: "", features: "", budget: "", deadline: "", referenceLink: "", notes: "" });
    setUiFile(null);
    setFileError("");
    setStatusMsg({ type: "", text: "" });
    setSubmitted(false);
  };

  const selectedType = ORDER_TYPES.find((t) => t.key === orderType);

  return (
    <div className="wmx-so-page">
      <div className="wmx-so-container">

        <div className="wmx-so-header">
          <span className="wmx-so-eyebrow">
            <span className="wmx-so-eyebrow-dot" />
            Custom Development
          </span>
          <h1 className="wmx-so-title">Smart Order</h1>
          <p className="wmx-so-subtitle">
            Share your project details and place an order — our team will get in touch shortly.
          </p>
        </div>

        <div className="wmx-so-tabs">
          {[
            { id: "place", label: "Place Order" },
            { id: "browse", label: "Browse Orders" },
            { id: "mine", label: "My Requests" },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={`wmx-so-tab-btn${activeTab === id ? " active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "place" && (
        <>
        <div className="wmx-so-steps">
          <div className={`wmx-so-step ${step >= 1 ? "wmx-so-step--active" : ""}`}>
            <span className="wmx-so-step-num">1</span>
            <span className="wmx-so-step-label">Order Type</span>
          </div>
          <div className="wmx-so-step-connector" />
          <div className={`wmx-so-step ${step >= 2 ? "wmx-so-step--active" : ""}`}>
            <span className="wmx-so-step-num">2</span>
            <span className="wmx-so-step-label">Details</span>
          </div>
        </div>

        {step === 1 && (
          <div className="wmx-so-type-wrap">
            <p className="wmx-so-type-q">What are you ordering for?</p>
            <div className="wmx-so-type-grid">
              {ORDER_TYPES.map((t) => (
                <button
                  key={t.key}
                  className="wmx-so-type-card"
                  onClick={() => handleTypeSelect(t.key)}
                >
                  <span className="wmx-so-type-icon"><FontAwesomeIcon icon={t.icon} /></span>
                  <span className="wmx-so-type-name">{t.label}</span>
                  <span className="wmx-so-type-desc">{t.desc}</span>
                  <span className="wmx-so-type-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && !submitted && (
          <form className="wmx-so-form" onSubmit={handleSubmit} noValidate>
            <div className="wmx-so-form-top">
              <button
                type="button"
                className="wmx-so-back"
                onClick={() => { setStep(1); setStatusMsg({ type: "", text: "" }); }}
              >
                ← Back
              </button>
              <span className="wmx-so-badge">
                <FontAwesomeIcon icon={selectedType?.icon} /> {selectedType?.label}
              </span>
            </div>

            <div className="wmx-so-field">
              <label className="wmx-so-label" htmlFor="siteType">
                Site Type <span className="wmx-so-req">*</span>
              </label>
              <select
                id="siteType"
                name="siteType"
                className="wmx-so-select"
                value={form.siteType}
                onChange={handleChange}
                required
              >
                <option value="">Select a type</option>
                {SITE_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="wmx-so-field">
              <label className="wmx-so-label" htmlFor="features">
                Feature List
                <span className="wmx-so-hint"> — separate with commas</span>
              </label>
              <textarea
                id="features"
                name="features"
                className="wmx-so-textarea"
                placeholder="Login system, Admin panel, Payment gateway, Dark mode..."
                value={form.features}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="wmx-so-row">
              <div className="wmx-so-field">
                <label className="wmx-so-label" htmlFor="budget">
                  Budget (USD) <span className="wmx-so-req">*</span>
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  className="wmx-so-input"
                  placeholder="e.g. 15000"
                  value={form.budget}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
              <div className="wmx-so-field">
                <label className="wmx-so-label" htmlFor="deadline">
                  Deadline <span className="wmx-so-req">*</span>
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="wmx-so-input"
                  value={form.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="wmx-so-field">
              <label className="wmx-so-label" htmlFor="referenceLink">
                Reference Link
                <span className="wmx-so-hint"> — optional</span>
              </label>
              <input
                id="referenceLink"
                name="referenceLink"
                type="url"
                className="wmx-so-input"
                placeholder="https://example.com"
                value={form.referenceLink}
                onChange={handleChange}
              />
            </div>

            <div className="wmx-so-field">
              <label className="wmx-so-label">
                UI/UX File
                <span className="wmx-so-hint"> — JPG, PNG, WEBP, PDF, max 10MB (optional)</span>
              </label>
              <div className="wmx-so-file-wrap">
                <input
                  id="uiFile"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  className="wmx-so-file-input"
                  onChange={handleFileChange}
                />
                <label htmlFor="uiFile" className="wmx-so-file-label">
                  {uiFile ? (
                    <span className="wmx-so-file-chosen"><FontAwesomeIcon icon={faCircleCheck} /> {uiFile.name}</span>
                  ) : (
                    <span>📁 Choose a file</span>
                  )}
                </label>
              </div>
              {fileError && <p className="wmx-so-file-err">{fileError}</p>}
            </div>

            <div className="wmx-so-field">
              <label className="wmx-so-label" htmlFor="notes">
                Additional Notes
                <span className="wmx-so-hint"> — optional</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                className="wmx-so-textarea"
                placeholder="Any extra details or requirements..."
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {statusMsg.text && (
              <div className={`wmx-so-status wmx-so-status--${statusMsg.type}`}>
                {statusMsg.text}
              </div>
            )}

            <button type="submit" className="wmx-so-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Place Order →"}
            </button>
          </form>
        )}

        {submitted && (
          <div className="wmx-so-success">
            <div className="wmx-so-success-orb" />
            <span className="wmx-so-success-icon"><FontAwesomeIcon icon={faRocket} /></span>
            <h2 className="wmx-so-success-title">Order Placed!</h2>
            <p className="wmx-so-success-msg">
              Your order has been submitted successfully. Our team will review it and get in touch with you shortly.
            </p>
            <button className="wmx-so-submit" onClick={handleReset}>
              Place Another Order
            </button>
          </div>
        )}
        </>
        )}

        {activeTab === "browse" && (
          <div className="wmx-so-list-wrap">
            {browseLoading ? (
              <p className="wmx-so-empty-msg">Loading open orders…</p>
            ) : browseOrders.length === 0 ? (
              <p className="wmx-so-empty-msg">No open orders right now. Check back later.</p>
            ) : (
              <>
                <div className="wmx-so-list">
                  {browseOrders.map((order) => (
                    <div key={order._id} className="wmx-so-list-item">
                      <SmartOrderCard order={order} mode="browse" onAction={openProposalModal} canPropose={isSeller} />
                      {proposedIds.has(order._id) && (
                        <span className="wmx-so-proposed-tag">Proposal Sent</span>
                      )}
                    </div>
                  ))}
                </div>
                {browseTotalPages > 1 && (
                  <div className="wmx-so-pagination">
                    <button
                      className="wmx-so-page-btn"
                      disabled={browsePage === 1}
                      onClick={() => setBrowsePage((p) => Math.max(1, p - 1))}
                    >
                      ← Prev
                    </button>
                    <span className="wmx-so-page-info">Page {browsePage} of {browseTotalPages}</span>
                    <button
                      className="wmx-so-page-btn"
                      disabled={browsePage === browseTotalPages}
                      onClick={() => setBrowsePage((p) => Math.min(browseTotalPages, p + 1))}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "mine" && (
          <div className="wmx-so-list-wrap">
            {mineLoading ? (
              <p className="wmx-so-empty-msg">Loading your requests…</p>
            ) : mineOrders.length === 0 ? (
              <p className="wmx-so-empty-msg">You haven't placed any smart orders yet.</p>
            ) : (
              <div className="wmx-so-list">
                {mineOrders.map((order) => (
                  <SmartOrderCard key={order._id} order={order} mode="mine" onAction={openProposalsModal} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {proposalTarget && (
        <div
          className="wmx-so-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setProposalTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Send Proposal"
        >
          <div className="wmx-so-modal">
            <div className="wmx-so-modal-hd">
              <h3 className="wmx-so-modal-title">Send Proposal — {proposalTarget.siteType}</h3>
              <button className="wmx-so-modal-close" onClick={() => setProposalTarget(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <form className="wmx-so-modal-body" onSubmit={submitProposal}>
              <div className="wmx-so-field">
                <label className="wmx-so-label" htmlFor="p-price">
                  Your Price (USD) <span className="wmx-so-req">*</span>
                </label>
                <input
                  id="p-price"
                  type="number"
                  min={1}
                  className="wmx-so-input"
                  value={proposalForm.price}
                  onChange={(e) => setProposalForm((p) => ({ ...p, price: e.target.value }))}
                  required
                />
              </div>
              <div className="wmx-so-field">
                <label className="wmx-so-label" htmlFor="p-timeline">
                  Timeline <span className="wmx-so-req">*</span>
                </label>
                <input
                  id="p-timeline"
                  type="text"
                  placeholder="e.g. 2 weeks"
                  className="wmx-so-input"
                  value={proposalForm.timeline}
                  onChange={(e) => setProposalForm((p) => ({ ...p, timeline: e.target.value }))}
                  required
                />
              </div>
              <div className="wmx-so-field">
                <label className="wmx-so-label" htmlFor="p-message">
                  Message <span className="wmx-so-hint"> — optional</span>
                </label>
                <textarea
                  id="p-message"
                  className="wmx-so-textarea"
                  rows={3}
                  value={proposalForm.message}
                  onChange={(e) => setProposalForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              {proposalStatusMsg.text && (
                <div className={`wmx-so-status wmx-so-status--${proposalStatusMsg.type}`}>
                  {proposalStatusMsg.text}
                </div>
              )}
              <button type="submit" className="wmx-so-submit" disabled={proposalSubmitting}>
                {proposalSubmitting ? "Sending..." : "Send Proposal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {proposalsTarget && (
        <div
          className="wmx-so-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setProposalsTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Proposals"
        >
          <div className="wmx-so-modal">
            <div className="wmx-so-modal-hd">
              <h3 className="wmx-so-modal-title">Proposals — {proposalsTarget.siteType}</h3>
              <button className="wmx-so-modal-close" onClick={() => setProposalsTarget(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="wmx-so-modal-body">
              {proposalsLoading ? (
                <p className="wmx-so-empty-msg">Loading proposals…</p>
              ) : proposalsList.length === 0 ? (
                <p className="wmx-so-empty-msg">No proposals yet.</p>
              ) : (
                proposalsList.map((p) => (
                  <div key={p._id} className="wmx-so-proposal-row">
                    <div className="wmx-so-proposal-top">
                      <span className="wmx-so-proposal-seller">{p.seller?.name || "Seller"}</span>
                      <span className={`wmx-so-proposal-status wmx-so-proposal-status--${p.status}`}>{p.status}</span>
                    </div>
                    <div className="wmx-so-proposal-meta">
                      <span>${p.price}</span>
                      <span>{p.timeline}</span>
                    </div>
                    {p.message && <p className="wmx-so-proposal-msg">{p.message}</p>}
                    {p.status === "pending" && (
                      confirmingProposalId === p._id ? (
                        <div className="wmx-so-proposal-confirm">
                          <span>Accept this proposal? Others will be rejected.</span>
                          <div className="wmx-so-proposal-confirm-btns">
                            <button
                              className="wmx-so-submit"
                              disabled={acceptingId === p._id}
                              onClick={() => acceptProposal(p._id)}
                            >
                              {acceptingId === p._id ? "Accepting..." : "Yes, Accept"}
                            </button>
                            <button className="wmx-so-back" onClick={() => setConfirmingProposalId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="wmx-soc-action-btn"
                          onClick={() => setConfirmingProposalId(p._id)}
                        >
                          Accept
                        </button>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
