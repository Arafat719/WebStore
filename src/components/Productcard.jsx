import React from 'react'
import { Link } from 'react-router-dom';

const Productcard = ({ arr }) => {
    const isFree = arr.price === "Free";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .wmx-card {
                    width: 300px;
                    background: #111118;
                    border: 1px solid rgba(134, 130, 250, 0.12);
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                    font-family: 'DM Sans', sans-serif;
                    flex-shrink: 0;
                }

                .wmx-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 50px rgba(134, 130, 250, 0.18);
                    border-color: rgba(134, 130, 250, 0.35);
                }

                /* Image area */
                .wmx-card-img-wrap {
                    position: relative;
                    overflow: hidden;
                    height: 180px;
                }

                .wmx-card-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                    display: block;
                }

                .wmx-card:hover .wmx-card-img-wrap img {
                    transform: scale(1.06);
                }

                /* Overlay shimmer on hover */
                .wmx-card-img-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, transparent 40%, rgba(10, 10, 20, 0.85) 100%);
                    pointer-events: none;
                }

                /* Free badge */
                .wmx-free-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    z-index: 2;
                    background: linear-gradient(135deg, #8682fa, #5f5bc7);
                    color: #fff;
                    font-family: 'Syne', sans-serif;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(134, 130, 250, 0.4);
                }

                /* Body */
                .wmx-card-body {
                    padding: 18px 18px 20px;
                }

                .wmx-card-title {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    font-size: 1rem;
                    color: #f0f0ff;
                    margin: 0 0 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .wmx-card-desc {
                    font-size: 0.8rem;
                    color: #5e5e72;
                    line-height: 1.55;
                    margin: 0 0 16px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Price row */
                .wmx-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 14px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }

                .wmx-price {
                    font-family: 'Syne', sans-serif;
                    font-weight: 800;
                    font-size: 1.25rem;
                    color: #8682fa;
                    line-height: 1;
                }

                .wmx-price.free {
                    background: linear-gradient(135deg, #8682fa, #b8b5ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* CTA Button */
                .wmx-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: #8682fa;
                    background: rgba(134, 130, 250, 0.1);
                    border: 1px solid rgba(134, 130, 250, 0.25);
                    border-radius: 8px;
                    padding: 7px 14px;
                    text-decoration: none;
                    transition: all 0.22s ease;
                    white-space: nowrap;
                }

                .wmx-btn:hover {
                    background: #8682fa;
                    color: #fff;
                    border-color: #8682fa;
                    box-shadow: 0 4px 16px rgba(134, 130, 250, 0.4);
                    gap: 9px;
                }

                .wmx-btn svg {
                    width: 12px;
                    height: 12px;
                    transition: transform 0.2s;
                }

                .wmx-btn:hover svg {
                    transform: translateX(2px);
                }

                /* Top-right corner glow */
                .wmx-card::before {
                    content: '';
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    width: 120px;
                    height: 120px;
                    background: radial-gradient(circle, rgba(134,130,250,0.08) 0%, transparent 70%);
                    pointer-events: none;
                    border-radius: 50%;
                    transition: opacity 0.3s;
                    opacity: 0;
                }

                .wmx-card:hover::before {
                    opacity: 1;
                }
            `}</style>

            <div className="wmx-card">
                {/* Image */}
                <div className="wmx-card-img-wrap">
                    {isFree && <span className="wmx-free-badge">Free</span>}
                    <img src={arr.images[0]} alt={arr.title} />
                </div>

                {/* Body */}
                <div className="wmx-card-body">
                    <h5 className="wmx-card-title">{arr.title}</h5>
                    <p className="wmx-card-desc">{arr.description}</p>

                    <div className="wmx-card-footer">
                        <span className={`wmx-price ${isFree ? 'free' : ''}`}>
                            {isFree ? 'Free' : `$${arr.price}`}
                        </span>
                        <Link to={`/products/${arr._id}`} className="wmx-btn">
                            Explore
                            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Productcard;