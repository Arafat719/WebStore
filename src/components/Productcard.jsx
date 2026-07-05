import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../css/Productcard.css';

const Productcard = ({ arr }) => {
    const isFree = arr.price === "Free";
    const category = arr.tags?.[0];
    const navigate = useNavigate();

    return (
        <>

            <div
              className="wmx-pc-card"
              tabIndex={0}
              role="article"
              aria-label={`${arr.title} - ${isFree ? 'Free' : '$' + arr.price}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/products/${arr._id}`);
              }}
              style={{ outline: 'none' }}
              onFocus={(e) => e.currentTarget.classList.add('wmx-pc-card--focused')}
              onBlur={(e) => e.currentTarget.classList.remove('wmx-pc-card--focused')}
            >
                {/* Image */}
                <div className="wmx-pc-thumb">
                    {isFree && <span className="wmx-pc-badge wmx-pc-badge--free">Free</span>}
                    {category && <span className="wmx-pc-badge wmx-pc-badge--cat">{category}</span>}
                    <img src={arr.images[0]} alt={arr.title} />
                </div>

                {/* Body */}
                <div className="wmx-pc-body">
                    <h5 className="wmx-pc-title">{arr.title}</h5>
                    <p className="wmx-pc-desc">{arr.description}</p>

                    <div className="wmx-pc-footer">
                        <span className={`wmx-pc-price ${isFree ? 'free' : ''}`}>
                            {isFree ? 'Free' : `$${arr.price}`}
                        </span>
                        <Link to={`/products/${arr._id}`} className="wmx-pc-cta">
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