import { useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function AddProducts({ showAlert }) {
    const navigate = useNavigate()
    const [projectName, setProjectName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");

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

    const handleClick = async (e) => {
        e.preventDefault();

        // 🔥 Cloudinary upload function
        const handleUpload = async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_upload");

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dps2dk2tj/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();
            console.log(data, 'from cloudinary')
            return data.secure_url;
        };

        // 🔥 images upload করে URL বানানো
        let uploadedImages = [];

        for (let img of products.images) {
            if (img && img.file instanceof File) {
                const url = await handleUpload(img.file);
                uploadedImages.push(url);
            }
        }

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

            // 🔥 এখন images হবে Cloudinary URL
            images: uploadedImages
        };

        // 🔥 same function call (no change)
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
            finalData.documentation,
            projectName,
            repoUrl
        );

        console.log(finalData);
        // navigate('/');
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
                <div className="mb-3 position-relative">
                    <label htmlFor="title" className="form-label"><strong>Project name (Repo name)</strong></label>
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="form-control"
                    />
                    {projectName && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setProjectName("")}
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
                <div className="mb-3 position-relative">


                    <label htmlFor="title" className="form-label"><strong>Repo URL</strong></label>

                    <input
                        type="url"
                        placeholder="GitHub Repo URL"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="form-control"
                    />
                    {repoUrl && (
                        <FontAwesomeIcon
                            icon={faTimes}
                            onClick={() => setRepoUrl("")}
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

                {/* Product Images */}
                <div className="mb-4">
                    <label className="form-label fw-bold mb-2">Product Images</label>

                    {/* Upload Box */}
                    <div
                        className="border rounded-4 p-4 text-center position-relative"
                        style={{
                            borderStyle: "dashed",
                            borderColor: "#d1d5db",
                            background: "#f9fafb",
                            cursor: "pointer",
                        }}
                        onClick={() => document.getElementById("imageUploadInput").click()}
                    >
                        <input
                            id="imageUploadInput"
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={(e) => {
                                const files = Array.from(e.target.files);

                                const newImages = files.map((file) => ({
                                    file: file,
                                    preview: URL.createObjectURL(file),
                                }));

                                setproducts({
                                    ...products,
                                    images: [...products.images, ...newImages],
                                });
                            }}
                        />

                        <div>
                            <i className="fas fa-cloud-upload-alt mb-2" style={{ fontSize: "28px", color: "#8682fa" }}></i>
                            <p className="mb-1 fw-semibold">Click or Drag images to upload</p>
                            <small className="text-muted">PNG, JPG up to 5MB</small>
                        </div>
                    </div>

                    {/* Preview Grid */}
                    <div className="row mt-3 g-3">
                        {products.images.map((img, index) => (
                            <div key={index} className="col-4 col-md-3 col-lg-2">
                                <div
                                    className="position-relative rounded-3 overflow-hidden shadow-sm"
                                    style={{
                                        height: "100px",
                                        background: "#f3f4f6",
                                    }}
                                >
                                    <img
                                        src={img.preview}
                                        alt="preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = products.images.filter((_, i) => i !== index);
                                            setproducts({ ...products, images: newImages });
                                        }}
                                        className="btn btn-sm position-absolute"
                                        style={{
                                            top: "5px",
                                            right: "5px",
                                            background: "rgba(0,0,0,0.6)",
                                            color: "#fff",
                                            borderRadius: "50%",
                                            width: "25px",
                                            height: "25px",
                                            padding: "0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add More Button */}
                    <button
                        type="button"
                        className="btn mt-3 px-4 py-2"
                        style={{
                            background: "linear-gradient(135deg, #8682fa, #6c63ff)",
                            color: "#fff",
                            borderRadius: "10px",
                            fontWeight: "500",
                        }}
                        onClick={() => document.getElementById("imageUploadInput").click()}
                    >
                        + Add More Images
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