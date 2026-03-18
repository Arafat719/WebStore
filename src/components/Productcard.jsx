import React from 'react'

const Productcard = ({ arr }) => {
    console.log(arr)
    return (
        <div className="card col-lg-3 col-md-4 col-sm-12 col-12 my-2" style={{
            backgroundColor: "white", // black with transparency
            borderRadius: "10px",
            marginLeft: "10px",
            width: "300px",
        }}>
            <div className='p-3'>
                <img src={arr.img} className="card-img-top" alt="img" />
                <div className="card-body p-0 pt-2" style={{color: "#8682fa"}}>
                    <h5 className='card-title'>{arr.title}</h5>
                    <p className="card-title text-dark">{arr.description}</p>
                    <hr />
                    <h3 className="card-text px-2 text-end">${arr.price}</h3>
                    <a href="#" className="btn text-white" style={{background: "#3b379c"}}>Visit website</a>
                </div>
            </div>
        </div>
    )
}

export default Productcard
