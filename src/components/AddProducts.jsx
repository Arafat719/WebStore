import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function AddProducts({ showAlert }) {
    const navigate = useNavigate()

    const context = useContext(userContext);
    const { addProducts } = context

    const [products, setproducts] = useState({
        title: "",
        images: [""],
        description: "",
        price: "",
        previewLink: "",
        tags: "",
        builtWith: "",
        features: "",
        documentation: '',
        support: "",

        // 🔥 এইটা add কর
    });

    const handleClick = (e) => {
        e.preventDefault();

        const finalData = {
            ...products,

            // 🔥 string → array convert
            tags: products.tags
                ? products.tags.split(",").map(item => item.trim())
                : [],

            builtWith: products.builtWith
                ? products.builtWith.split(",").map(item => item.trim())
                : [],

            features: products.features
                ? products.features.split(",").map(item => item.trim())
                : [],

            // 🔥 empty image remove
            images: products.images.filter(img => img !== "")
        };

        // 🔥 এখন clean data পাঠা
        addProducts(
            finalData.images,
            finalData.title,
            finalData.description,
            finalData.price,
            finalData.previewLink,
            finalData.tags,
            finalData.builtWith,
            finalData.features,
            finalData.support,
            finalData.documentation
        );
        console.log(products)
        navigate('/');
    };
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

        <div className="container-md my-5 py-1">
            <form className="card p-5 col-md-6 mx-auto shadow border-0">
                <h2 className="my-3">Add website for sell</h2>

                {/* Product Images */}
                <div className="mb-3">
                    <label className="form-label"><strong>Product Images</strong></label>
                    {products.images.map((img, index) => (
                        <div key={index} className="position-relative mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Image URL"
                                value={img}
                                onChange={(e) => {
                                    const newImages = [...products.images];
                                    newImages[index] = e.target.value;
                                    setproducts({ ...products, images: newImages });
                                }}
                                style={{ paddingRight: "2.5rem" }}
                            />
                            {/* Remove Button */}
                            {img && (
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    onClick={() => {
                                        const newImages = products.images.filter((_, i) => i !== index);
                                        setproducts({ ...products, images: newImages });
                                    }}
                                    style={{
                                        position: "absolute",
                                        right: "0.5rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#888",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    {/* Add New Image Button */}
                    <button
                        type="button"
                        className="btn mt-2"
                        style={{ backgroundColor: "#8682fa", color: "#fff" }}
                        onClick={() =>
                            setproducts({ ...products, images: [...products.images, ""] })
                        }
                    >
                        + Add Image
                    </button>
                </div>

                {/* Title */}
                <div className="mb-3 position-relative">
                    <label htmlFor="title" className="form-label"><strong>Title</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        onChange={onchange}
                        value={products.title}
                        style={{ paddingRight: "2rem" }}
                    />
                    {products.title && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setproducts({ ...products, title: "" })}
                            style={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "72%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                            }}
                        />
                    )}
                </div>

                {/* Description */}
                <div className="mb-3 position-relative">
                    <label htmlFor="description" className="form-label"><strong>Description</strong></label>
                    <textarea
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        onChange={onchange}
                        value={products.description}
                        style={{ paddingRight: "2rem" }}
                    />
                    {products.description && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setproducts({ ...products, description: "" })}
                            style={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "52%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                            }}
                        />
                    )}
                </div>

                {/* Price & Preview Link */}
                <div className="row">
                    <div className="col-md-6 mb-3 position-relative">
                        <label htmlFor="price" className="form-label"><strong>Price</strong></label>
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
                                    right: "1.2rem",
                                    top: "72%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888",
                                }}
                            />
                        )}
                    </div>

                    <div className="col-md-6 mb-3 position-relative">
                        <label htmlFor="preview" className="form-label"><strong>Preview Link</strong></label>
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
                                    right: "1.2rem",
                                    top: "72%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888",
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-3 position-relative">
                    <label htmlFor="tags" className="form-label">
                        <strong>Tags</strong> (Comma separated)
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="tags"
                        name="tags"
                        onChange={onchange}
                        value={products.tags}
                    />
                    {products.tags.length > 0 && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setproducts({ ...products, tags: "" })}
                            style={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "73%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                            }}
                        />
                    )}
                </div>

                {/* Build With */}
                <div className="mb-3 position-relative">
                    <label htmlFor="build" className="form-label"><strong>Build with</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        id="build"
                        name="builtWith"
                        onChange={onchange}
                        value={products.builtWith}
                    />
                    {products.builtWith.length > 0 && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setproducts({ ...products, builtWith: "" })}
                            style={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "73%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                            }}
                        />
                    )}
                </div>

                {/* Features */}
                <div className="mb-3 position-relative">
                    <label htmlFor="feature" className="form-label"><strong>Feature</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        id="feature"
                        name="features"
                        onChange={onchange}
                        value={products.features}
                    />
                    {products.features.length > 0 && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setproducts({ ...products, features: "" })}
                            style={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "73%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#888",
                            }}
                        />
                    )}
                </div>

                <hr />

                {/* Support Duration & Checkbox */}
                <div className="row align-items-center">
                    <div className="col-md-6 mb-3 position-relative">
                        <label htmlFor="support" className="form-label"><strong>Support Duration</strong></label>
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
                                    right: "1.1rem",
                                    top: "72%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#888",
                                }}
                            />
                        )}
                    </div>

                    <div className="col-md-6 mb-3 d-flex align-items-center mt-md-4">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={products.documentation}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;

                                    setproducts((prev) => ({
                                        ...prev,
                                        documentation: isChecked,
                                    }));
                                }} />
                            <label className="form-check-label" htmlFor="exampleCheck1">
                                Documentation Included
                            </label>

                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn rounded-pill text-white"
                    onClick={handleClick}
                    style={{ backgroundColor: "#8682fa" }}
                >
                    Publish Products
                </button>
            </form>
        </div>
    );
}

export default AddProducts;