import React from 'react'

const Productcard = ({ arr }) => {
    return (
        <div className="card productscard col-lg-3 col-md-4 col-sm-12 col-12 my-2" style={{
            backgroundColor: "white", // black with transparency
            borderRadius: "10px",
            // marginLeft: "10px",
            width: "300px",
        }}>
            <div className='p-3'>
                <img src={arr.img} className="card-img-top" alt="img" style={{
                    width: "100 %",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px"
                }} />
                <div className="card-body p-0 pt-2" style={{ color: "#8682fa" }}>
                    {arr.price === "Free" ?<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{background: "#3b379c"}}>
                        Free
                        <span className="visually-hidden">unread messages</span>
                    </span>: ""}
                    <h5 className='card-title'>{arr.title}</h5>
                    <p className="card-title text-dark">{arr.description}</p>
                    <hr />
                    <h3 className="card-text px-2 text-end">{arr.price === "Free" ? "Free" : `$${arr.price}`}</h3>
                    <div className='d-flex justify-content-between'>
                        <a href="#" className="btntwo" style={{ color: "#3b379c" }}>Explore More</a>
                        <a href="#" className="btn text-white" style={{ background: "#3b379c" }}>Buy Free</a>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Productcard
