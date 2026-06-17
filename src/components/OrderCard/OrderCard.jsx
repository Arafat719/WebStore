import { Calendar, Download, MessageCircle, RotateCcw, Eye, User } from "lucide-react";
import "./OrderCard.css";

const STATUS_CONFIG = {
  Pending:              { cssVar: "var(--warning)", hex: "#f59e0b", label: "Pending" },
  Processing:           { cssVar: "var(--info)",    hex: "#60a5fa", label: "Processing" },
  Completed:            { cssVar: "var(--success)", hex: "#4ade80", label: "Completed" },
  Cancelled:            { cssVar: "var(--danger)",  hex: "#f87171", label: "Cancelled" },
  "Refund Requested":   { cssVar: "#f97316",         hex: "#f97316", label: "Refund Requested" },
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const OrderCard = ({ order, onViewDetails, userRole, index }) => {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Pending;

  return (
    <article className="wmx-orders-card" style={{ "--i": index }}>

      <div className="wmx-orders-card-top">
        <div className="wmx-orders-thumb">
          {order.productImage ? (
            <img
              src={order.productImage}
              alt={order.productName}
              className="wmx-orders-thumb-img"
            />
          ) : (
            <div className="wmx-orders-thumb-placeholder" />
          )}
        </div>

        <div className="wmx-orders-info">
          <div className="wmx-orders-info-header">
            <h3 className="wmx-orders-name">{order.productName}</h3>
            <span className="wmx-orders-price">${order.price.toFixed(2)}</span>
          </div>

          <div className="wmx-orders-meta">
            <span className="wmx-orders-id">#{order.id}</span>
            <span className="wmx-orders-date">
              <Calendar size={11} />
              {formatDate(order.date)}
            </span>
          </div>

          <div className="wmx-orders-badges">
            <span className="wmx-orders-badge-category">{order.category}</span>
            <span className="wmx-orders-badge-license">{order.license}</span>
          </div>

          {order.buyerName && (
            <div className="wmx-orders-buyer-row">
              <User size={11} className="wmx-orders-buyer-icon" />
              <span className="wmx-orders-buyer-name">{order.buyerName}</span>
              {order.buyerEmail && (
                <span className="wmx-orders-buyer-email">{order.buyerEmail}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="wmx-orders-card-footer">
        {/* Status — inline style is the spec-approved exception for dynamic color */}
        <span
          className="wmx-orders-status"
          style={{
            color: status.cssVar,
            background: `${status.hex}1a`,
            borderColor: `${status.hex}33`,
          }}
        >
          <span
            className="wmx-orders-status-dot"
            style={{ background: status.cssVar }}
          />
          {status.label}
        </span>

        <div className="wmx-orders-actions">
          <button
            className="wmx-orders-btn-accent"
            onClick={() => onViewDetails(order)}
          >
            <Eye size={13} />
            View Details
          </button>

          {order.status === "Completed" && userRole !== "seller" && (
            <button className="wmx-orders-btn-ghost">
              <Download size={13} />
              Download
            </button>
          )}

          <button className="wmx-orders-btn-ghost wmx-orders-btn-sm">
            <MessageCircle size={12} />
            {userRole === "buyer" ? "Contact Seller" : "Contact Buyer"}
          </button>

          {order.status === "Completed" && userRole !== "seller" && (
            <button className="wmx-orders-btn-danger">
              <RotateCcw size={12} />
              Request Refund
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default OrderCard;
