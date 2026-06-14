import React from 'react'
import { Link } from 'react-router-dom';
import '../css/Productcard.css';

const Productcard = ({ arr }) => {
    const isFree = arr.price === "Free";

    return (
        <>

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