import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'

function AddProducts({showAlert}) {
    const navigate = useNavigate()

    const context = useContext(userContext);
    const { addProducts } = context

    const [products, setproducts] = useState([])

    const handleClick = (e) => {
        e.preventDefault()
        addProducts(products.img, products.title, products.description, products.price)
        navigate('/')
    }

    const onchange = (e) => {
        setproducts({ ...products, [e.target.name]: e.target.value })
    }
    useEffect(() => {
    const token = localStorage.getItem("token"); // Token check
    if (!token) {
      navigate("/login"); 
      showAlert("To Add website You must be Logged in with us", "danger")
    }
  }, []);
    return (
        <>
            <div className='container-md my-5 py-1'>
                <form className='card p-5 col-md-5 mx-auto shadow border-0'>
                    <h2 className='my-3'>Add website for sell</h2>
                    <div className="mb-3">
                        <label htmlFor="img" className="form-label">Product's Photo</label>
                        <input type="text" className="form-control" id="img" name="img" onChange={onchange} placeholder='Image URL link' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" onChange={onchange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" onChange={onchange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input type="text" className="form-control" id="price" name="price" onChange={onchange} />
                    </div>
                    <button type="submit" className="btn rounded-pill" style={{ backgroundColor: "#8682fa" }} onClick={handleClick}>Add Products</button>
                </form>
            </div>
        </>
    );
}

export default AddProducts;