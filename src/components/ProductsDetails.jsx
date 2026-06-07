import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar, faArrowLeft, faGlobe, faDownload, faCalendar, faRefresh, faFileLines, faHeadset, faTag, faCode } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(`https://webmarketbackend.onrender.com/products/getbyid/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleDownload = async () => {
    const res = await fetch(`/api/download/${product?.repoName}`, {
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '3px solid rgba(134,130,250,0.2)',
          borderTopColor: '#8682fa', borderRadius: '50%', margin: '0 auto 16px',
          animation: 'wmx-spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#5a5a6e', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>Loading product...</p>
      </div>
    </div>
  );

  const isFree = product.price === "Free" || product.price === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes wmx-spin { to { transform: rotate(360deg); } }
        @keyframes wmx-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .wmx-pd {
          background: #0a0a0f;
          min-height: 100vh;
          padding: 100px 24px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        .wmx-pd-wrap {
          max-width: 1160px;
          margin: 0 auto;
          animation: wmx-fadein 0.4s ease;
        }

        /* Back button */
        .wmx-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.8rem; color: #5a5a6e;
          background: none; border: none; cursor: pointer;
          padding: 0; margin-bottom: 32px;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .wmx-back:hover { color: #8682fa; }

        /* Layout */
        .wmx-pd-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }

        /* Card base */
        .wmx-card {
          background: #111118;
          border: 1px solid rgba(134,130,250,0.1);
          border-radius: 18px;
          overflow: hidden;
        }
        .wmx-card-pad { padding: 28px; }

        /* Hero image */
        .wmx-hero-img {
          width: 100%; height: 320px;
          object-fit: cover;
          display: block;
          cursor: pointer;
          transition: transform 0.4s ease;
        }
        .wmx-hero-img:hover { transform: scale(1.015); }
        .wmx-img-wrapper { overflow: hidden; }

        /* Thumbnails */
        .wmx-thumbs {
          display: flex; gap: 8px; padding: 16px 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
          overflow-x: auto;
        }
        .wmx-thumb {
          width: 70px; height: 50px; flex-shrink: 0;
          border-radius: 8px; overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer; transition: border-color 0.2s;
        }
        .wmx-thumb.active { border-color: #8682fa; }
        .wmx-thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* Title area */
        .wmx-title-row {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 16px;
          margin-bottom: 6px;
        }
        .wmx-product-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.6rem;
          color: #f2f2ff; letter-spacing: -0.5px;
          margin: 0; line-height: 1.2;
        }
        .wmx-price-badge {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.5rem;
          color: #8682fa; flex-shrink: 0;
        }
        .wmx-price-badge.free {
          background: linear-gradient(135deg, #8682fa, #b8b5ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .wmx-meta {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .wmx-meta-text { font-size: 0.78rem; color: #4a4a5a; }
        .wmx-rating-row {
          display: flex; align-items: center; gap: 4px;
        }
        .wmx-star { font-size: 0.75rem; }

        /* Stars */
        .star-on  { color: #f5c518; }
        .star-off { color: #2a2a38; }

        /* Divider */
        .wmx-divider {
          height: 1px; background: rgba(255,255,255,0.05);
          margin: 22px 0;
        }

        /* Section heading */
        .wmx-sec-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.85rem;
          color: #f2f2ff; letter-spacing: 0.5px;
          margin: 0 0 14px;
        }

        /* Description */
        .wmx-desc {
          font-size: 0.875rem; color: #6a6a80;
          line-height: 1.75; margin: 0;
        }

        /* Features grid */
        .wmx-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 10px;
        }
        .wmx-feature-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 12px;
          background: rgba(134,130,250,0.05);
          border: 1px solid rgba(134,130,250,0.1);
          border-radius: 10px;
          font-size: 0.8rem; color: #9090a8;
          line-height: 1.4;
        }
        .wmx-feature-check {
          color: #8682fa; font-size: 0.65rem;
          margin-top: 2px; flex-shrink: 0;
        }

        /* Gallery */
        .wmx-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }
        .wmx-gallery img {
          width: 100%; height: 130px;
          object-fit: cover; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
        }
        .wmx-gallery img:hover {
          border-color: rgba(134,130,250,0.3);
          transform: scale(1.02);
        }

        /* Sidebar */
        .wmx-sidebar { display: flex; flex-direction: column; gap: 16px; }

        /* Buy button */
        .wmx-buy-btn {
          width: 100%; padding: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.95rem;
          color: #fff;
          background: linear-gradient(135deg, #8682fa, #5f5bc7);
          border: none; border-radius: 12px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 24px rgba(134,130,250,0.35);
          transition: all 0.25s ease;
        }
        .wmx-buy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(134,130,250,0.5);
        }

        .wmx-preview-btn {
          width: 100%; padding: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; font-size: 0.875rem;
          color: #8682fa;
          background: rgba(134,130,250,0.08);
          border: 1px solid rgba(134,130,250,0.22);
          border-radius: 12px;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.22s ease;
        }
        .wmx-preview-btn:hover {
          background: rgba(134,130,250,0.16);
          color: #b8b5ff;
        }

        /* Info rows */
        .wmx-info-row {
          display: flex; align-items: flex-start;
          gap: 12px; padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .wmx-info-row:last-child { border-bottom: none; }
        .wmx-info-icon {
          width: 30px; height: 30px; flex-shrink: 0;
          background: rgba(134,130,250,0.1);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #8682fa; font-size: 0.7rem;
        }
        .wmx-info-label {
          font-size: 0.7rem; color: #4a4a5a;
          text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 2px;
        }
        .wmx-info-value {
          font-size: 0.82rem; color: #c0c0d8; font-weight: 500;
        }

        /* Tags / badges */
        .wmx-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .wmx-tag {
          font-size: 0.7rem; padding: 4px 10px;
          border-radius: 20px; font-weight: 500;
        }
        .wmx-tag-tech {
          background: rgba(134,130,250,0.1);
          color: #8682fa;
          border: 1px solid rgba(134,130,250,0.2);
        }
        .wmx-tag-label {
          background: rgba(255,255,255,0.05);
          color: #6a6a80;
          border: 1px solid rgba(255,255,255,0.07);
        }

        /* Rating card */
        .wmx-rating-big {
          display: flex; align-items: center; gap: 16px;
        }
        .wmx-rating-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 2.4rem;
          color: #f2f2ff; line-height: 1;
        }
        .wmx-stars-col { display: flex; flex-direction: column; gap: 4px; }
        .wmx-stars-row { display: flex; gap: 3px; }
        .wmx-rating-count { font-size: 0.75rem; color: #4a4a5a; }

        @media (max-width: 900px) {
          .wmx-pd-grid { grid-template-columns: 1fr; }
          .wmx-sidebar { flex-direction: column; }
        }
        @media (max-width: 520px) {
          .wmx-pd { padding: 90px 14px 60px; }
          .wmx-card-pad { padding: 18px; }
          .wmx-hero-img { height: 200px; }
          .wmx-features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wmx-pd">
        <div className="wmx-pd-wrap">

          {/* Back */}
          <button className="wmx-back" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to listings
          </button>

          <div className="wmx-pd-grid">

            {/* ── LEFT ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Main image card */}
              <div className="wmx-card">
                <div className="wmx-img-wrapper">
                  <img
                    src={product.images[activeImg]}
                    alt="product"
                    className="wmx-hero-img"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="wmx-thumbs">
                    {product.images.map((img, i) => (
                      <div
                        key={i}
                        className={`wmx-thumb ${activeImg === i ? 'active' : ''}`}
                        onClick={() => setActiveImg(i)}
                      >
                        <img src={img} alt={`thumb-${i}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details card */}
              <div className="wmx-card wmx-card-pad">

                {/* Title + price */}
                <div className="wmx-title-row">
                  <h1 className="wmx-product-title">{product.title}</h1>
                  <div className={`wmx-price-badge ${isFree ? 'free' : ''}`}>
                    {isFree ? 'Free' : `$${product.price}`}
                  </div>
                </div>

                <div className="wmx-meta">
                  <span className="wmx-meta-text">by DevMaster</span>
                  <span style={{ color: '#2a2a38' }}>·</span>
                  <div className="wmx-rating-row">
                    {[1,2,3,4,5].map(s => (
                      <FontAwesomeIcon
                        key={s} icon={faStar}
                        className={`wmx-star ${s <= product.rating ? 'star-on' : 'star-off'}`}
                      />
                    ))}
                  </div>
                  <span className="wmx-meta-text">{product.totalReviews} reviews</span>
                </div>

                <div className="wmx-divider" />

                {/* Description */}
                <p className="wmx-sec-title">Description</p>
                <p className="wmx-desc">{product.description}</p>

                <div className="wmx-divider" />

                {/* Features */}
                <p className="wmx-sec-title">Features</p>
                <div className="wmx-features-grid">
                  {product.features.map((f, i) => (
                    <div key={i} className="wmx-feature-item">
                      <FontAwesomeIcon icon={faCheck} className="wmx-feature-check" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Gallery */}
                {product.images.length > 1 && (
                  <>
                    <div className="wmx-divider" />
                    <p className="wmx-sec-title">Gallery</p>
                    <div className="wmx-gallery">
                      {product.images.map((img, i) => (
                        <img
                          key={i} src={img} alt={`gallery-${i}`}
                          onClick={() => setActiveImg(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="wmx-sidebar">

              {/* Buy / Preview */}
              <div className="wmx-card wmx-card-pad">
                <button className="wmx-buy-btn" onClick={handleDownload}>
                  <FontAwesomeIcon icon={faDownload} />
                  {isFree ? 'Download Free' : 'Buy Now'}
                </button>
                <div style={{ marginTop: 10 }}>
                  <a
                    href={product.previewLink}
                    target="_blank" rel="noreferrer"
                    className="wmx-preview-btn"
                  >
                    <FontAwesomeIcon icon={faGlobe} />
                    Live Preview
                  </a>
                </div>
              </div>

              {/* Product info */}
              <div className="wmx-card wmx-card-pad">
                <p className="wmx-sec-title" style={{ marginBottom: 6 }}>Product Info</p>

                <div className="wmx-info-row">
                  <div className="wmx-info-icon"><FontAwesomeIcon icon={faCalendar} /></div>
                  <div>
                    <div className="wmx-info-label">Uploaded</div>
                    <div className="wmx-info-value">{new Date(product.createdAt).toDateString()}</div>
                  </div>
                </div>

                <div className="wmx-info-row">
                  <div className="wmx-info-icon"><FontAwesomeIcon icon={faRefresh} /></div>
                  <div>
                    <div className="wmx-info-label">Last Updated</div>
                    <div className="wmx-info-value">{new Date(product.updatedAt).toDateString()}</div>
                  </div>
                </div>

                <div className="wmx-info-row">
                  <div className="wmx-info-icon"><FontAwesomeIcon icon={faFileLines} /></div>
                  <div>
                    <div className="wmx-info-label">Documentation</div>
                    <div className="wmx-info-value">{product.documentation ? "Included ✓" : "Not Included"}</div>
                  </div>
                </div>

                <div className="wmx-info-row">
                  <div className="wmx-info-icon"><FontAwesomeIcon icon={faHeadset} /></div>
                  <div>
                    <div className="wmx-info-label">Support</div>
                    <div className="wmx-info-value">{product.support}</div>
                  </div>
                </div>
              </div>

              {/* Built with */}
              <div className="wmx-card wmx-card-pad">
                <p className="wmx-sec-title" style={{ marginBottom: 12 }}>
                  <FontAwesomeIcon icon={faCode} style={{ marginRight: 8, color: '#8682fa', fontSize: '0.8rem' }} />
                  Built With
                </p>
                <div className="wmx-tags">
                  {product.builtWith.map((item, i) => (
                    <span key={i} className="wmx-tag wmx-tag-tech">{item}</span>
                  ))}
                </div>

                <div className="wmx-divider" />

                <p className="wmx-sec-title" style={{ marginBottom: 12 }}>
                  <FontAwesomeIcon icon={faTag} style={{ marginRight: 8, color: '#8682fa', fontSize: '0.8rem' }} />
                  Tags
                </p>
                <div className="wmx-tags">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="wmx-tag wmx-tag-label">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="wmx-card wmx-card-pad">
                <p className="wmx-sec-title" style={{ marginBottom: 14 }}>Rating & Reviews</p>
                <div className="wmx-rating-big">
                  <div className="wmx-rating-num">{product.rating}</div>
                  <div className="wmx-stars-col">
                    <div className="wmx-stars-row">
                      {[1,2,3,4,5].map(s => (
                        <FontAwesomeIcon
                          key={s} icon={faStar}
                          className={s <= product.rating ? 'star-on' : 'star-off'}
                          style={{ fontSize: '0.9rem' }}
                        />
                      ))}
                    </div>
                    <span className="wmx-rating-count">{product.totalReviews} reviews</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;