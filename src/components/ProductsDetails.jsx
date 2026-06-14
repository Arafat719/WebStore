import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faStar, faArrowLeft, faGlobe, faDownload,
  faCalendar, faRefresh, faFileLines, faHeadset,
  faTag, faCode, faUser, faAlignLeft, faImage
} from '@fortawesome/free-solid-svg-icons';
import '../css/ProductsDetails.css';
import ReviewSection from "./Reviewsection";
import userContext from "../context/userContext";

const ProductDetails = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const { userId } = useContext(userContext);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = userId ? { _id: userId, name: storedUser?.name || "" } : null;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/getbyid/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.log(err));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/download/${product?.repoName}`, {
      headers: { "auth-token": localStorage.getItem("token") }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product?.repoName}.zip`;
    a.click();
  };

  if (!product) return (
    <div className="wmx-pd-loading">
      <div className="wmx-pd-spinner" />
      <p className="wmx-pd-loading-text">Loading product...</p>
    </div>
  );

  const isFree = product.price === "Free" || product.price === 0;
  const images = product.images ?? [];

  return (
    <div className="wmx-pd">

      <div className="wmx-pd-topbar">
        <button className="wmx-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to listings
        </button>
      </div>

      <div className="wmx-pd-layout">

        {/* LEFT PANEL */}
        <div className="wmx-left-panel">

          <div className="wmx-img-box">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={product.title} className="wmx-hero-img" />
            ) : (
              <div className="wmx-img-placeholder">
                <FontAwesomeIcon icon={faImage} />
                <span>No image</span>
              </div>
            )}
            <div className="wmx-img-badge">
              <span className="wmx-pulse-dot" />
              Digital Product
            </div>
          </div>

          {images.length > 1 && (
            <div className="wmx-thumbs">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`wmx-thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
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
            <span className="wmx-chip">
              <FontAwesomeIcon icon={faUser} />
              DevMaster
            </span>
            <span className="wmx-chip wmx-chip-stars">
              {[1,2,3,4,5].map(s => (
                <FontAwesomeIcon
                  key={s} icon={faStar}
                  className={s <= product.rating ? 'star-on' : 'star-off'}
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
                    className={activeImg === i ? 'active' : ''}
                    onClick={() => setActiveImg(i)}
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
            <button className="wmx-buy-btn" onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} />
              {isFree ? 'Download Free' : 'Buy Now'}
            </button>
            {product.previewLink && (
              <a href={product.previewLink} target="_blank" rel="noreferrer" className="wmx-preview-btn">
                <FontAwesomeIcon icon={faGlobe} />
                Live Preview
              </a>
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
                    <FontAwesomeIcon key={s} icon={faStar} className={s <= product.rating ? 'star-on' : 'star-off'} />
                  ))}
                </div>
                <div className="wmx-rat-c">{product.totalReviews} reviews</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="wmx-pd-reviews">
        <ReviewSection productId={product._id} currentUser={currentUser} showAlert={showAlert} />
      </div>
    </div>
  );
};

export default ProductDetails;