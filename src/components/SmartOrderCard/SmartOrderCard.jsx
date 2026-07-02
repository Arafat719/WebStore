import { DollarSign, Clock, User, MessageSquareText } from "lucide-react";
import "./SmartOrderCard.css";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const ORDER_TYPE_LABEL = {
  web_product: "For Web Product",
  own_business: "For Own Business",
};

const SmartOrderCard = ({ order, mode, onAction, canPropose = true }) => {
  const proposalCount = order.proposals?.length ?? order.proposalCount ?? 0;

  return (
    <div className="wmx-soc-card">
      <div className="wmx-soc-top">
        <div>
          <span className="wmx-soc-type-badge">{ORDER_TYPE_LABEL[order.orderType] || order.orderType}</span>
          <h3 className="wmx-soc-title">{order.siteType}</h3>
        </div>
        <span className={`wmx-soc-status wmx-soc-status--${order.status}`}>{order.status.replace("_", " ")}</span>
      </div>

      {order.features?.length > 0 && (
        <div className="wmx-soc-features">
          {order.features.slice(0, 4).map((f, i) => (
            <span key={i} className="wmx-soc-feature-chip">{f}</span>
          ))}
          {order.features.length > 4 && (
            <span className="wmx-soc-feature-chip wmx-soc-feature-more">+{order.features.length - 4} more</span>
          )}
        </div>
      )}

      <div className="wmx-soc-meta">
        <span className="wmx-soc-meta-item">
          <DollarSign size={14} /> ${order.budget}
        </span>
        <span className="wmx-soc-meta-item">
          <Clock size={14} /> {formatDate(order.deadline)}
        </span>
        {mode === "browse" && order.user?.name && (
          <span className="wmx-soc-meta-item">
            <User size={14} /> {order.user.name}
          </span>
        )}
        {mode === "mine" && (
          <span className="wmx-soc-meta-item">
            <MessageSquareText size={14} /> {proposalCount} proposal{proposalCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {mode === "browse" && !canPropose ? (
        <span className="wmx-soc-seller-only-note">Only sellers can send proposals</span>
      ) : (
        <button className="wmx-soc-action-btn" onClick={() => onAction(order)}>
          {mode === "browse" ? "Send Proposal" : "View Proposals"}
        </button>
      )}
    </div>
  );
};

export default SmartOrderCard;
