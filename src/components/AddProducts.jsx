import React from 'react'

const AddProducts = ({ arr }) => {
    console.log(arr)
    return (
        <div className="card col-lg-3 col-md-4 col-sm-12 col-12 my-2" style={{
            backgroundColor: "white", // black with transparency
            borderRadius: "10px",
            // color: "white",
            width: "300px",
        }}>
            <div className='p-3'>
                <img src={arr.img} className="card-img-top" alt="img" />
                <div className="card-body p-0 pt-2" style={{color: "#8682fa"}}>
                    <h5 className="card-title">{arr.caption}</h5>
                    <hr />
                    <h3 className="card-text p-0">{arr.price}</h3>
                    <a href="#" className="btn text-white" style={{background: "#3b379c"}}>Visit website</a>
                </div>
            </div>
        </div>
    )
}

export default AddProducts
