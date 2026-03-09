import React from 'react'

const AddProducts = ({ arr }) => {
    console.log(arr)
    return (
        <div className="card col my-1 pt-4" style={{
            backgroundColor: "rgba(0,0,0,0.2)", // black with transparency
            // backdropFilter: "blur(10px)",       // blur effect
            // WebkitBackdropFilter: "blur(10px)", // Safari support
            padding: "20px",
            borderRadius: "10px",
            color: "white",
            // width: "300px",
            // textAlign: "center",
        }}>
            <img src={arr.img} className="card-img-top" alt="img" />
            <div className="card-body">
                <h5 className="card-title">{arr.caption}</h5>
                <h3 className="card-text">{arr.price}</h3>
                <a href="#" className="btn btn-primary">Visit website</a>
            </div>
        </div>
    )
}

export default AddProducts
