import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function AddProducts({ showAlert }) {
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
            showAlert("To Add website You must be Logged in with us", "warning")
        }
    }, []);
    return (
        <>
            <div className='container-md my-5 py-1'>
                <form className='card p-5 col-md-5 mx-auto shadow border-0'>
                    <h2 className='my-3'>Add website for sell</h2>

                    {/* Product's Photo */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="img" className="form-label">Product's Photo</label>
                        <input type="text" className="form-control" id="img" name="img" onChange={onchange} value={products.img} placeholder='Image URL link' style={{ paddingRight: "2rem" }} />
                        {products.img && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, img: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "72%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" onChange={onchange} value={products.title} style={{ paddingRight: "2rem" }} />
                        {products.title && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, title: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "72%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" onChange={onchange} value={products.description} style={{ paddingRight: "2rem" }} />
                        {products.description && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, description: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "72%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>

                    {/* Price */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input type="text" className="form-control" id="price" name="price" onChange={onchange} value={products.price} style={{ paddingRight: "2rem" }} />
                        {products.price && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, price: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "51%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                        <div id="priceHelp" className="form-text">
                            If you like to sell for free you can skip.
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn rounded-pill"
                        style={{ backgroundColor: "#8682fa" }}
                        onClick={handleClick}
                    >
                        Add Products
                    </button>
                </form>
            </div>
        </>
    );
    // return (
    //     <>
    //         {
    //             <div className='container-md my-5 py-1'>
    //             <form className='card p-5 col-md-5 mx-auto shadow border-0'>
    //                 <h2 className='my-3'>Add website for sell</h2>
    //                 <div className="mb-3">
    //                     <label htmlFor="img" className="form-label">Product's Photo</label>
    //                     <input type="text" className="form-control" id="img" name="img" onChange={onchange} placeholder='Image URL link' />
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="title" className="form-label">Title</label>
    //                     <input type="text" className="form-control" id="title" name="title" onChange={onchange} />
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="description" className="form-label">Description</label>
    //                     <input type="text" className="form-control" id="description" name="description" onChange={onchange} />
    //                 </div>
    //                 <div className="mb-3">
    //                     <label htmlFor="price" className="form-label">Price</label>
    //                     <input type="text" className="form-control" id="price" name="price" onChange={onchange} />
    //                     <div id="price" className="form-text">If you like to sell for free you can skip.</div>
    //                 </div>
    //                 <button type="submit" className="btn rounded-pill" style={{ backgroundColor: "#8682fa" }} onClick={handleClick}>Add Products</button>
    //             </form>
    //         </div>}
    //     </>
    // );
}

export default AddProducts;