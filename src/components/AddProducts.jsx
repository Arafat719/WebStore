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
        addProducts(products.img, products.title, products.description, products.price, products.previewLink, products.tags, products.builtWith, products.features, products.support)
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
                <form className='card p-5 col-md-6 mx-auto shadow border-0'>
                    <h2 className='my-3'>Add website for sell</h2>

                    {/* Product's Photo */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="img" className="form-label">Image URL</label>
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
                        <textarea type="text" className="form-control" id="description" name="description" onChange={onchange} value={products.description} style={{ paddingRight: "2rem" }} />
                        {products.description && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, description: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "52%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>

                    <div className="row">
                        {/* Price */}
                        <div className="col-md-6 mb-3 position-relative">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input
                                type="text"
                                className="form-control"
                                id="price"
                                name="price"
                                onChange={onchange}
                                value={products.price}
                            />

                            {products.price && (
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    onClick={() => setproducts({ ...products, price: "" })}
                                    style={{
                                        position: "absolute",
                                        right: "0.5rem",
                                        top: "53%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#888"
                                    }}
                                />
                            )}

                        </div>

                        {/* Preview Link */}
                        <div className="col-md-6 mb-3 position-relative">
                            <label htmlFor="preview" className="form-label">Preview Link</label>
                            <input
                                type="text"
                                className="form-control"
                                id="preview"
                                name="previewLink"
                                onChange={onchange}
                                value={products.previewLink}
                            />

                            {products.previewLink && (
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    onClick={() => setproducts({ ...products, previewLink: "" })}
                                    style={{
                                        position: "absolute",
                                        right: "0.5rem",
                                        top: "53%", // 🔥 এটা ঠিক করে দিলাম
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#888"
                                    }}
                                />
                            )}
                        </div>

                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="tags" className="form-label">Tags (Comma separated)</label>
                        <input type="text" className="form-control" id="tags" name="tags" onChange={onchange} value={products.tags} />
                        {products.tags && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, tags: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "73%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="build" className="form-label">Build With</label>
                        <input type="text" className="form-control" id="build" name="builtWith" onChange={onchange} value={products.builtWith} />
                        {products.builtWith && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, builtWith: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "73%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="feature" className="form-label">Features</label>
                        <input type="text" className="form-control" id="feature" name="features" onChange={onchange} value={products.features} />
                        {products.features && (
                            <FontAwesomeIcon icon={faTimes} onClick={() => setproducts({ ...products, features: "" })}
                                style={{
                                    position: "absolute",
                                    right: "0.5rem",
                                    top: "73%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888"
                                }}
                            />
                        )}
                    </div>
                    <hr />
                    <div className="row align-items-center">

                        {/* Support Duration */}
                        <div className="col-md-6 mb-3 position-relative">
                            <label htmlFor="support" className="form-label">Support Duration</label>
                            <input
                                type="text"
                                className="form-control"
                                id="support"
                                name="support"
                                onChange={onchange}
                                value={products.support}
                            />

                            {products.support && (
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    onClick={() => setproducts({ ...products, support: "" })}
                                    style={{
                                        position: "absolute",
                                        right: "0.5rem",
                                        top: "53%", // 🔥 fix
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#888"
                                    }}
                                />
                            )}
                        </div>

                        {/* Checkbox */}
                        <div className="col-md-6 mb-3 d-flex align-items-center mt-md-4">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck1"
                                />
                                <label className="form-check-label" htmlFor="exampleCheck1">
                                    Documentation Included
                                </label>
                            </div>
                        </div>

                    </div>
                    <button type='submit' className='btn rounded-pill' onClick={handleClick} style={{ backgroundColor: "#8682fa" }}>Publish Products</button>
                </form>
            </div>
        </>

    );
}

export default AddProducts;