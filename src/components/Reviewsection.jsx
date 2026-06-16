import { useState, useEffect } from "react";
import "../css/Reviewsection.css";

// ⭐ Star Rating display component
const StarDisplay = ({ rating, size = "md" }) => {
  return (
    <div className={`wmx-stars wmx-stars--${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`wmx-star ${star <= Math.round(rating) ? "wmx-star--filled" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// ⭐ Interactive star picker for form
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="wmx-star-picker">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`wmx-star wmx-star--pick ${
            star <= (hovered || value) ? "wmx-star--filled" : ""
          }`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </span>
      ))}
      <span className="wmx-star-label">
        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hovered || value] || "Select rating"}
      </span>
    </div>
  );
};

// 🕒 Time ago helper
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// 👤 Avatar with initials fallback
const Avatar = ({ user }) => {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return user?.avatar ? (
    <img src={user.avatar} alt={user.name} className="wmx-review-avatar" />
  ) : (
    <div className="wmx-review-avatar wmx-review-avatar--initials">{initials}</div>
  );
};

// 📊 Rating breakdown bar
const RatingBar = ({ rating, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="wmx-rating-bar">
      <span className="wmx-rating-bar__label">{rating}★</span>
      <div className="wmx-rating-bar__track">
        <div className="wmx-rating-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="wmx-rating-bar__count">{count}</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// 🔑 Main ReviewSection component
// Props:
//   productId  — product page-এ pass করো
//   sellerId   — seller profile page-এ pass করো
//   currentUser — logged in user object (null হলে form দেখাবে না)
// ─────────────────────────────────────────────
const ReviewSection = ({ productId, sellerId, currentUser, showAlert }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) showAlert("To write a Review you must be Logged in with us", "warning");
  }, []);

  // ── Fetch reviews ──
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const endpoint = productId
          ? `${API_BASE}/reviews/product/${productId}`
          : `${API_BASE}/reviews/seller/${sellerId}`;

        const res = await fetch(endpoint);
        const data = await res.json();

        setReviews(data.reviews || []);
        setAvgRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (productId || sellerId) fetchReviews();
  }, [productId, sellerId]);

  // ── Rating breakdown ──
  const ratingBreakdown = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => Math.round(rev.rating) === r).length,
  }));

  // ── Submit review ──
  const handleSubmit = async () => {
    if (!rating) return setError("Please select a rating.");
    if (!comment.trim()) return setError("Please write a comment.");

    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        },
        body: JSON.stringify({ productId, sellerId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Optimistic update
      setReviews((prev) => [data.review, ...prev]);
      setTotalReviews((prev) => prev + 1);
      setAvgRating(
        parseFloat(
          (((avgRating * totalReviews) + rating) / (totalReviews + 1)).toFixed(1)
        )
      );

      setRating(0);
      setComment("");
      setSuccess("Review submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete review ──
  const handleDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "token": token },
      });
      if (!res.ok) throw new Error("Failed to delete");

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setTotalReviews((prev) => prev - 1);
    } catch {
      setError("Could not delete review.");
    }
  };

  const alreadyReviewed =
    currentUser && reviews.some((r) => r.user?._id === currentUser._id);

  return (
    <section className="wmx-reviews">
      <div className="wmx-reviews__header">
        <h2 className="wmx-reviews__title">
          <span className="wmx-reviews__title-dot" />
          Reviews
        </h2>
      </div>

      {/* ── Summary ── */}
      {totalReviews > 0 && (
        <div className="wmx-reviews__summary">
          <div className="wmx-reviews__score">
            <span className="wmx-reviews__avg">{avgRating}</span>
            <StarDisplay rating={avgRating} size="lg" />
            <span className="wmx-reviews__total">{totalReviews} reviews</span>
          </div>
          <div className="wmx-reviews__breakdown">
            {ratingBreakdown.map((b) => (
              <RatingBar key={b.rating} {...b} total={totalReviews} />
            ))}
          </div>
        </div>
      )}

      {/* ── Write review form (only on product page + logged in + not reviewed) ── */}
      {productId && currentUser && !alreadyReviewed && (
        <div className="wmx-review-form">
          <h3 className="wmx-review-form__title">Write a Review</h3>

          <StarPicker value={rating} onChange={setRating} />

          <textarea
            className="wmx-review-form__textarea"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div className="wmx-review-form__count">{comment.length}/500</div>

          {error && <p className="wmx-review-form__error">{error}</p>}
          {success && <p className="wmx-review-form__success">{success}</p>}

          <button
            className="wmx-btn wmx-btn--primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {alreadyReviewed && (
        <p className="wmx-reviews__already">You've already reviewed this product.</p>
      )}

      {/* ── Review list ── */}
      {loading ? (
        <div className="wmx-reviews__loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="wmx-review-skeleton">
              <div className="wmx-skeleton wmx-skeleton--avatar" />
              <div className="wmx-review-skeleton__body">
                <div className="wmx-skeleton wmx-skeleton--line" style={{ width: "40%" }} />
                <div className="wmx-skeleton wmx-skeleton--line" />
                <div className="wmx-skeleton wmx-skeleton--line" style={{ width: "70%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="wmx-reviews__empty">
          <span className="wmx-reviews__empty-icon">💬</span>
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="wmx-reviews__list">
          {reviews.map((review) => (
            <div key={review._id} className="wmx-review-card">
              <div className="wmx-review-card__top">
                <Avatar user={review.user} />
                <div className="wmx-review-card__meta">
                  <span className="wmx-review-card__name">
                    {review.user?.name || "Anonymous"}
                  </span>
                  {sellerId && review.product && (
                    <span className="wmx-review-card__product">
                      on {review.product.title}
                    </span>
                  )}
                  <div className="wmx-review-card__rating-row">
                    <StarDisplay rating={review.rating} size="sm" />
                    <span className="wmx-review-card__date">
                      {timeAgo(review.createdAt)}
                    </span>
                  </div>
                </div>
                {currentUser?._id === review.user?._id && (
                  <button
                    className="wmx-review-card__delete"
                    onClick={() => handleDelete(review._id)}
                    title="Delete review"
                  >
                    ✕
                  </button>
                )}
              </div>
              {review.comment && (
                <p className="wmx-review-card__comment">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;