import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, ShoppingBag, ChevronLeft, ChevronRight,
  X, CheckCircle, Circle, Clock,
} from "lucide-react";
import OrderCard from "../../components/OrderCard/OrderCard";
import "./MyOrders.css";

const ORDERS_PER_PAGE = 3;

const STATUS_OPTIONS = [
  "All Orders",
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
  "Refund Requested",
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "oldest",     label: "Oldest First" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low",  label: "Price: Low to High" },
];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getTimelineSteps = (order) => {
  const d = formatDate(order.date);
  return [
    { label: "Order Placed",      time: d,         done: true },
    { label: "Payment Confirmed", time: d,         done: order.status !== "Cancelled" },
    { label: "Seller Notified",   time: d,         done: !["Cancelled", "Pending"].includes(order.status) },
    { label: "Product Delivered", time: "Pending", done: ["Completed", "Refund Requested"].includes(order.status) },
    { label: "Review Submitted",  time: "Not yet", done: false },
  ];
};

const normalizeOrder = (o) => {
  const rawPrice = o.amount ?? o.product?.price;
  const price = rawPrice === "Free" || rawPrice === "0" || rawPrice === 0
    ? 0
    : typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
  return {
    id: o._id,
    productName: o.product?.title || "Unknown Product",
    productImage: o.product?.images?.[0] || null,
    category: o.product?.tags?.[0] || "Digital Product",
    license: "Standard License",
    price,
    date: o.createdAt,
    status: o.status || "Pending",
  };
};

const MyOrders = () => {
  const [activeTab, setActiveTab]         = useState("purchases");
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All Orders");
  const [sort, setSort]                   = useState("newest");
  const [page, setPage]                   = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/orders`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        setOrders((data.orders || []).map(normalizeOrder));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const baseOrders = useMemo(
    () => activeTab === "purchases" ? orders : [],
    [activeTab, orders]
  );

  const filteredOrders = useMemo(() => {
    let result = baseOrders;

    if (statusFilter !== "All Orders") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.productName.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      if (sort === "newest")     return new Date(b.date) - new Date(a.date);
      if (sort === "oldest")     return new Date(a.date) - new Date(b.date);
      if (sort === "price-high") return b.price - a.price;
      if (sort === "price-low")  return a.price - b.price;
      return 0;
    });
  }, [baseOrders, search, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const pageOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setStatusFilter("All Orders");
  };

  const platformFee = selectedOrder
    ? parseFloat((selectedOrder.price * 0.05).toFixed(2))
    : 0;
  const totalPaid = selectedOrder
    ? parseFloat((selectedOrder.price + platformFee).toFixed(2))
    : 0;

  const timelineSteps = selectedOrder ? getTimelineSteps(selectedOrder) : [];
  const firstPendingIdx = timelineSteps.findIndex((s) => !s.done);

  return (
    <section className="wmx-orders-section">

      <div className="wmx-orders-header">
        <div className="wmx-orders-orb" />
        <div className="wmx-orders-eyebrow">
          <span className="wmx-orders-eyebrow-dot" />
          ORDER HISTORY
        </div>
        <h1 className="wmx-orders-title">My Orders</h1>
        <p className="wmx-orders-subtitle">Track and manage your purchases</p>
      </div>

      <div className="wmx-orders-tabs">
        {[
          { id: "purchases", label: "Purchases" },
          { id: "sales",     label: "Sales" },
        ].map(({ id, label }) => (
          <button
            key={id}
            className={`wmx-orders-tab-btn${activeTab === id ? " active" : ""}`}
            onClick={() => handleTabChange(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="wmx-orders-filters">
        <div className="wmx-orders-search-wrap">
          <Search size={15} className="wmx-orders-search-icon" />
          <input
            type="text"
            className="wmx-orders-search"
            placeholder="Search by product name or order ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          className="wmx-orders-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="wmx-orders-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="wmx-orders-empty">
          <p style={{ color: "rgba(226,226,240,0.5)", fontSize: "0.9rem" }}>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="wmx-orders-empty">
          <ShoppingBag size={54} className="wmx-orders-empty-icon" />
          <h3 className="wmx-orders-empty-title">No orders found</h3>
          <p className="wmx-orders-empty-sub">
            {activeTab === "purchases"
              ? "You haven't made any purchases yet."
              : "You haven't made any sales yet."}
          </p>
          {activeTab === "purchases" && (
            <Link to="/" className="wmx-orders-btn-accent" style={{ textDecoration: "none" }}>
              Browse Marketplace →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="wmx-orders-list">
            {pageOrders.map((order, i) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={setSelectedOrder}
                userRole={activeTab === "purchases" ? "buyer" : "seller"}
                index={i}
              />
            ))}
          </div>

          <div className="wmx-orders-pagination">
            <span className="wmx-orders-pagination-info">
              Showing {(page - 1) * ORDERS_PER_PAGE + 1}–
              {Math.min(page * ORDERS_PER_PAGE, filteredOrders.length)} of{" "}
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </span>

            <div className="wmx-orders-pagination-controls">
              <button
                className="wmx-orders-page-btn wmx-orders-page-arrow"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  className={`wmx-orders-page-btn${page === p ? " active" : ""}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                className="wmx-orders-page-btn wmx-orders-page-arrow"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedOrder && (
        <div
          className="wmx-orders-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Order Details"
        >
          <div className="wmx-orders-modal">

            <div className="wmx-orders-modal-hd">
              <div>
                <div className="wmx-orders-modal-order-id">#{selectedOrder.id}</div>
                <div className="wmx-orders-modal-order-date">
                  {formatDate(selectedOrder.date)}
                </div>
              </div>
              <button
                className="wmx-orders-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="wmx-orders-modal-body">

              <div className="wmx-orders-modal-product">
                <div className="wmx-orders-modal-thumb">
                  {selectedOrder.productImage ? (
                    <img src={selectedOrder.productImage} alt={selectedOrder.productName} />
                  ) : (
                    <div className="wmx-orders-modal-thumb-placeholder" />
                  )}
                </div>
                <div>
                  <div className="wmx-orders-modal-product-name">{selectedOrder.productName}</div>
                  <div className="wmx-orders-modal-product-meta">
                    {selectedOrder.category} · {selectedOrder.license}
                  </div>
                </div>
              </div>

              <div>
                <div className="wmx-orders-timeline-title">Order Timeline</div>
                <div className="wmx-orders-timeline">
                  {timelineSteps.map((step, i) => (
                    <div key={i} className={`wmx-orders-timeline-step${step.done ? " done" : ""}`}>
                      <div className="wmx-orders-timeline-indicator">
                        <div className="wmx-orders-timeline-icon">
                          {step.done ? (
                            <CheckCircle size={18} />
                          ) : i === firstPendingIdx ? (
                            <Clock size={18} />
                          ) : (
                            <Circle size={18} />
                          )}
                        </div>
                        {i < timelineSteps.length - 1 && (
                          <div className="wmx-orders-timeline-line" />
                        )}
                      </div>
                      <div className="wmx-orders-timeline-content">
                        <div className="wmx-orders-timeline-label">{step.label}</div>
                        <div className="wmx-orders-timeline-time">{step.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="wmx-orders-payment-title">Payment Summary</div>
                <div className="wmx-orders-payment-table">
                  <div className="wmx-orders-payment-row">
                    <span className="wmx-orders-payment-label">Product Price</span>
                    <span className="wmx-orders-payment-value">
                      ${selectedOrder.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="wmx-orders-payment-row">
                    <span className="wmx-orders-payment-label">Platform Fee (5%)</span>
                    <span className="wmx-orders-payment-value">
                      ${platformFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="wmx-orders-payment-row wmx-orders-payment-total">
                    <span className="wmx-orders-payment-label">Total Paid</span>
                    <span className="wmx-orders-payment-value">
                      ${totalPaid.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="wmx-orders-modal-ft">
              <button className="wmx-orders-btn-accent">Download Invoice</button>
              <button
                className="wmx-orders-btn-ghost"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyOrders;
