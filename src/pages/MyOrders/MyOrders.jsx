import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, ShoppingBag, Package, ChevronLeft, ChevronRight,
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

const formatHistDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const datePart = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${datePart}, ${timePart}`;
};

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
    productId: o.product?._id || null,
    repoName: o.product?.repoName || null,
  };
};

const normalizeSaleOrder = (o) => {
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
    buyerName: o.buyer?.name || o.buyerName || "Unknown Buyer",
    buyerEmail: o.buyer?.email || o.buyerEmail || "",
  };
};

const OrderCardSkeleton = ({ index }) => (
  <div className="wmx-orders-skeleton" style={{ "--i": index }}>
    <div className="wmx-orders-skeleton-top">
      <div className="wmx-orders-skeleton-thumb wmx-orders-shimmer" />
      <div className="wmx-orders-skeleton-info">
        <div className="wmx-orders-skeleton-line wmx-orders-shimmer" style={{ width: "60%" }} />
        <div className="wmx-orders-skeleton-line wmx-orders-shimmer" style={{ width: "40%" }} />
        <div className="wmx-orders-skeleton-line wmx-orders-shimmer" style={{ width: "30%" }} />
      </div>
    </div>
    <div className="wmx-orders-skeleton-footer">
      <div className="wmx-orders-skeleton-badge wmx-orders-shimmer" />
      <div className="wmx-orders-skeleton-btns">
        <div className="wmx-orders-skeleton-btn wmx-orders-shimmer" />
        <div className="wmx-orders-skeleton-btn wmx-orders-shimmer" />
      </div>
    </div>
  </div>
);

const MyOrders = () => {
  const [activeTab, setActiveTab]         = useState("purchases");
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All Orders");
  const [sort, setSort]                   = useState("newest");
  const [page, setPage]                   = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [salesOrders, setSalesOrders]     = useState([]);
  const [salesLoading, setSalesLoading]   = useState(false);
  const [salesError, setSalesError]       = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [buyerHistory, setBuyerHistory]             = useState([]);
  const [buyerHistoryLoading, setBuyerHistoryLoading] = useState(false);
  const [buyerHistoryError, setBuyerHistoryError]   = useState('');
  const [buyerHistoryFetched, setBuyerHistoryFetched] = useState(false);
  const [dlHistory, setDlHistory]                   = useState([]);
  const [dlHistoryLoading, setDlHistoryLoading]     = useState(false);
  const [dlHistoryError, setDlHistoryError]         = useState('');
  const [dlHistoryFetched, setDlHistoryFetched]     = useState(false);

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

  useEffect(() => {
    if (activeTab !== "sales") return;
    setSalesLoading(true);
    setSalesError(false);
    const token = localStorage.getItem("token");
    fetch(`${API}/orders/sales`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        setSalesOrders((data.orders || []).map(normalizeSaleOrder));
        setSalesLoading(false);
      })
      .catch(() => {
        setSalesLoading(false);
        setSalesError(true);
      });
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "purchaseHistory" || buyerHistoryFetched) return;
    const token = localStorage.getItem("token");
    setBuyerHistoryLoading(true);
    setBuyerHistoryError('');
    fetch(`${API}/api/history/buyer`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        setBuyerHistory(
          Array.isArray(data.transactions) ? data.transactions :
          Array.isArray(data) ? data : []
        );
      })
      .catch(() => setBuyerHistoryError('Failed to load purchase history.'))
      .finally(() => { setBuyerHistoryLoading(false); setBuyerHistoryFetched(true); });
  }, [activeTab, buyerHistoryFetched]);

  useEffect(() => {
    if (activeTab !== "downloadHistory" || dlHistoryFetched) return;
    const token = localStorage.getItem("token");
    setDlHistoryLoading(true);
    setDlHistoryError('');
    fetch(`${API}/api/history/downloads`, { headers: { token } })
      .then(r => r.json())
      .then(data => {
        setDlHistory(Array.isArray(data) ? data : (data.downloads || []));
      })
      .catch(() => setDlHistoryError('Failed to load download history.'))
      .finally(() => { setDlHistoryLoading(false); setDlHistoryFetched(true); });
  }, [activeTab, dlHistoryFetched]);

  const baseOrders = useMemo(
    () => activeTab === "purchases" ? orders : salesOrders,
    [activeTab, orders, salesOrders]
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

  const isLoading = activeTab === "purchases" ? loading : salesLoading;

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const pageOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const handleDownload = async (order) => {
    const githubUsername = import.meta.env.VITE_GITHUB_USERNAME;
    const token = localStorage.getItem('token');
    setDownloadLoading(true);
    try {
      const res = await fetch(
        `${API}/git/download/${githubUsername}/${order.repoName}`,
        { headers: { token } }
      );
      if (!res.ok) return;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${order.repoName}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
      fetch(`${API}/api/history/log-download`, {
        method: 'POST',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: order.productId,
          productTitle: order.productName,
          orderId: order.id,
        }),
      }).catch(() => {});
    } catch {}
    finally { setDownloadLoading(false); }
  };

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
          { id: "purchases",       label: "Purchases" },
          { id: "sales",           label: "Sales" },
          { id: "purchaseHistory", label: "Purchase History" },
          { id: "downloadHistory", label: "Download History" },
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

      {(activeTab === "purchases" || activeTab === "sales") && (
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
      )}

      {(activeTab === "purchases" || activeTab === "sales") && (isLoading ? (
        <div className="wmx-orders-list">
          {[0, 1, 2].map((i) => (
            <OrderCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : activeTab === "sales" && salesError ? (
        <div className="wmx-orders-error">
          Failed to load sales. Please try again.
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="wmx-orders-empty">
          {activeTab === "sales" ? (
            <Package size={54} className="wmx-orders-empty-icon" />
          ) : (
            <ShoppingBag size={54} className="wmx-orders-empty-icon" />
          )}
          <h3 className="wmx-orders-empty-title">
            {activeTab === "sales" ? "No sales yet" : "No orders found"}
          </h3>
          <p className="wmx-orders-empty-sub">
            {activeTab === "purchases"
              ? "You haven't made any purchases yet."
              : "Start selling to see your sales here."}
          </p>
          {activeTab === "purchases" && (
            <Link to="/" className="wmx-orders-btn-accent" style={{ textDecoration: "none" }}>
              Browse Marketplace →
            </Link>
          )}
          {activeTab === "sales" && (
            <Link to="/addproducts" className="wmx-orders-btn-accent" style={{ textDecoration: "none" }}>
              Add a Product
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
      ))}

      {/* Purchase History tab */}
      {activeTab === "purchaseHistory" && (
        <div className="wmx-orders-hist-list">
          {buyerHistoryLoading ? (
            <>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="wmx-orders-hist-skeleton">
                  <div className="wmx-orders-hist-sk-icon wmx-orders-shimmer" />
                  <div className="wmx-orders-hist-sk-body">
                    <div className="wmx-orders-hist-sk-line wmx-orders-shimmer" style={{ width: "55%" }} />
                    <div className="wmx-orders-hist-sk-line wmx-orders-shimmer" style={{ width: "35%" }} />
                  </div>
                  <div className="wmx-orders-hist-sk-badge wmx-orders-shimmer" />
                  <div className="wmx-orders-hist-sk-amount wmx-orders-shimmer" />
                </div>
              ))}
            </>
          ) : buyerHistoryError ? (
            <div className="wmx-orders-error">{buyerHistoryError}</div>
          ) : buyerHistory.length === 0 ? (
            <div className="wmx-orders-hist-empty">
              <div className="wmx-orders-hist-empty-icon">🧾</div>
              <h3 className="wmx-orders-hist-empty-title">No purchases yet</h3>
              <p className="wmx-orders-hist-empty-sub">Your purchase history will appear here.</p>
            </div>
          ) : (
            <>
              {buyerHistory.map((tx, i) => (
                <div key={tx._id || i} className="wmx-orders-hist-row">
                  <div className="wmx-orders-hist-icon">🧾</div>
                  <div className="wmx-orders-hist-main">
                    <div className="wmx-orders-hist-title">{tx.productTitle}</div>
                    {tx.counterpartyName && (
                      <div className="wmx-orders-hist-meta">Seller: {tx.counterpartyName}</div>
                    )}
                  </div>
                  <div className="wmx-orders-hist-amount">
                    {tx.amount === 0 ? 'Free' : `৳${tx.amount}`}
                  </div>
                  <span className="wmx-orders-hist-badge wmx-orders-hist-badge-purchased">Purchased</span>
                  <div className="wmx-orders-hist-date">{formatHistDate(tx.createdAt)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Download History tab */}
      {activeTab === "downloadHistory" && (
        <div className="wmx-orders-hist-list">
          {dlHistoryLoading ? (
            <>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="wmx-orders-hist-skeleton">
                  <div className="wmx-orders-hist-sk-icon wmx-orders-shimmer" />
                  <div className="wmx-orders-hist-sk-body">
                    <div className="wmx-orders-hist-sk-line wmx-orders-shimmer" style={{ width: "60%" }} />
                  </div>
                  <div className="wmx-orders-hist-sk-amount wmx-orders-shimmer" />
                </div>
              ))}
            </>
          ) : dlHistoryError ? (
            <div className="wmx-orders-error">{dlHistoryError}</div>
          ) : dlHistory.length === 0 ? (
            <div className="wmx-orders-hist-empty">
              <div className="wmx-orders-hist-empty-icon">📥</div>
              <h3 className="wmx-orders-hist-empty-title">No downloads yet</h3>
              <p className="wmx-orders-hist-empty-sub">Files you download will appear here.</p>
            </div>
          ) : (
            <>
              {dlHistory.map((dl, i) => (
                <div key={dl._id || i} className="wmx-orders-hist-row">
                  <div className="wmx-orders-hist-icon">📥</div>
                  <div className="wmx-orders-hist-main">
                    <div className="wmx-orders-hist-title">{dl.productTitle}</div>
                  </div>
                  <div className="wmx-orders-hist-date">{formatHistDate(dl.downloadedAt)}</div>
                </div>
              ))}
            </>
          )}
        </div>
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

              {activeTab === 'purchases' && (
                <div>
                  <div className="wmx-orders-payment-title">Product Delivery</div>
                  {selectedOrder.repoName ? (
                    <div className="wmx-orders-delivery-box">
                      <span className="wmx-orders-delivery-label">Repository</span>
                      <span className="wmx-orders-delivery-repo">{selectedOrder.repoName}</span>
                    </div>
                  ) : (
                    <p className="wmx-orders-delivery-pending">Delivery info will be available shortly.</p>
                  )}
                </div>
              )}

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
              {activeTab === 'purchases' && selectedOrder.repoName && (
                <button
                  className="wmx-orders-btn-accent"
                  onClick={() => handleDownload(selectedOrder)}
                  disabled={downloadLoading}
                >
                  {downloadLoading ? 'Downloading…' : 'Download Product'}
                </button>
              )}
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
