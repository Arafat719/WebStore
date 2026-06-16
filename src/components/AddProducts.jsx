import { useContext, useState, useEffect } from 'react'
import userContext from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCloudArrowUp, faPlus, faCode, faLink, faDollarSign, faTags, faWrench, faList, faHeadset, faFileLines, faGlobe, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import '../css/AddProducts.css';

function AddProducts({ showAlert }) {
    const [projectName, setProjectName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const context = useContext(userContext);
    const { addProducts } = context

    const [products, setproducts] = useState({
        title: "", images: [""], description: "", price: "",
        previewLink: "", tags: "", builtWith: "", features: "",
        documentation: false, support: "",
    });

    const validateForm = () => {
        if (!products.title?.trim()) {
            showAlert("Product title is required", "error");
            return false;
        }
        if (!products.description?.trim()) {
            showAlert("Description is required", "error");
            return false;
        }
        if (!products.price) {
            showAlert("Price is required", "error");
            return false;
        }
        if (!projectName?.trim()) {
            showAlert("Project / Repo name is required", "error");
            return false;
        }
        if (!repoUrl?.trim()) {
            showAlert("GitHub Repo URL is required", "error");
            return false;
        }
        if (products.images.filter(i => i?.preview).length === 0) {
            showAlert("At least one image is required", "error");
            return false;
        }
        return true;
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const handleUpload = async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_upload");
            const res = await fetch("https://api.cloudinary.com/v1_1/dps2dk2tj/image/upload", { method: "POST", body: formData });
            const data = await res.json();
            return data.secure_url;
        };
        let uploadedImages = [];
        for (let img of products.images) {
            if (img && img.file instanceof File) {
                const url = await handleUpload(img.file);
                uploadedImages.push(url);
            }
        }
        const finalData = {
            ...products,
            tags: products.tags ? products.tags.split(",").map(i => i.trim()) : [],
            builtWith: products.builtWith ? products.builtWith.split(",").map(i => i.trim()) : [],
            features: products.features ? products.features.split(",").map(i => i.trim()) : [],
            images: uploadedImages
        };
        const repoName = repoUrl ? repoUrl.split("/").filter(Boolean).pop() : "";
        await addProducts(finalData.images, finalData.title, finalData.description, finalData.price,
            finalData.previewLink, finalData.tags, finalData.builtWith, finalData.features,
            finalData.support, finalData.documentation, projectName, repoUrl, repoName);
    };

    const onchange = (e) => setproducts({ ...products, [e.target.name]: e.target.value });

    const addImages = (files) => {
        const newImages = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
        setproducts(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) showAlert("To Add website You must be Logged in with us", "warning");
    }, []);

    return (
        <>

            <div className="wmx-add-page">
                <div className="wmx-add-wrap">

                    {/* Header */}
                    <div className="wmx-add-header">
                        <div className="wmx-add-eyebrow">
                            <span className="wmx-add-dot" />
                            Sell on WebMarketX
                        </div>
                        <h1 className="wmx-add-title">List Your <span>Website</span></h1>
                        <p className="wmx-add-sub">Fill in the details below to publish your product.</p>
                    </div>

                    {/* ── Section 1: Repository ── */}
                    <div className="wmx-add-section">
                        <div className="wmx-add-section-title">
                            <FontAwesomeIcon icon={faCode} /> Repository Info
                        </div>

                        <div className="wmx-add-field">
                            <label className="wmx-add-label">Project / Repo Name</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faBoxOpen} /></span>
                                <input className="wmx-add-input" type="text" placeholder="my-awesome-project"
                                    value={projectName} onChange={e => setProjectName(e.target.value)} />
                                {projectName && <button className="wmx-clear-btn" type="button" onClick={() => setProjectName("")}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                        </div>

                        <div className="wmx-add-field" style={{ marginBottom: 0 }}>
                            <label className="wmx-add-label">GitHub Repo URL</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faLink} /></span>
                                <input className="wmx-add-input" type="url" placeholder="https://github.com/user/repo"
                                    value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
                                {repoUrl && <button className="wmx-clear-btn" type="button" onClick={() => setRepoUrl("")}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                        </div>
                    </div>

                    {/* ── Section 2: Images ── */}
                    <div className="wmx-add-section">
                        <div className="wmx-add-section-title">
                            <FontAwesomeIcon icon={faCloudArrowUp} /> Product Images
                        </div>

                        <div
                            className={`wmx-upload-zone ${dragOver ? 'drag' : ''}`}
                            onClick={() => document.getElementById("wmx-img-input").click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
                        >
                            <input id="wmx-img-input" type="file" accept="image/*" multiple hidden
                                onChange={e => addImages(e.target.files)} />
                            <FontAwesomeIcon icon={faCloudArrowUp} className="wmx-upload-icon" />
                            <div className="wmx-upload-label">Click or drag images here</div>
                            <div className="wmx-upload-hint">PNG, JPG up to 5MB each</div>
                        </div>

                        {products.images.filter(i => i?.preview).length > 0 && (
                            <div className="wmx-preview-grid">
                                {products.images.map((img, index) => img?.preview && (
                                    <div key={index} className="wmx-preview-item">
                                        <img src={img.preview} alt="preview" />
                                        <button type="button" className="wmx-preview-remove"
                                            onClick={() => setproducts(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }))}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" className="wmx-add-more-btn"
                            onClick={() => document.getElementById("wmx-img-input").click()}>
                            <FontAwesomeIcon icon={faPlus} /> Add More Images
                        </button>
                    </div>

                    {/* ── Section 3: Product Info ── */}
                    <div className="wmx-add-section">
                        <div className="wmx-add-section-title">
                            <FontAwesomeIcon icon={faBoxOpen} /> Product Details
                        </div>

                        <div className="wmx-add-field">
                            <label className="wmx-add-label">Title</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faBoxOpen} /></span>
                                <input className="wmx-add-input" type="text" name="title" placeholder="E-commerce React Template"
                                    value={products.title} onChange={onchange} />
                                {products.title && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, title: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                        </div>

                        <div className="wmx-add-field">
                            <label className="wmx-add-label">Description</label>
                            <textarea className="wmx-add-textarea" name="description"
                                placeholder="Describe what your website/template does..."
                                value={products.description} onChange={onchange} />
                        </div>

                        <div className="wmx-two-col">
                            <div className="wmx-add-field" style={{ marginBottom: 0 }}>
                                <label className="wmx-add-label">Price (USD)</label>
                                <div className="wmx-add-input-wrap">
                                    <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faDollarSign} /></span>
                                    <input className="wmx-add-input" type="text" name="price" placeholder='29 or "Free"'
                                        value={products.price} onChange={onchange} />
                                    {products.price && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, price: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                                </div>
                            </div>
                            <div className="wmx-add-field" style={{ marginBottom: 0 }}>
                                <label className="wmx-add-label">Preview Link</label>
                                <div className="wmx-add-input-wrap">
                                    <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faGlobe} /></span>
                                    <input className="wmx-add-input" type="text" name="previewLink" placeholder="https://mysite.vercel.app"
                                        value={products.previewLink} onChange={onchange} />
                                    {products.previewLink && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, previewLink: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 4: Meta ── */}
                    <div className="wmx-add-section">
                        <div className="wmx-add-section-title">
                            <FontAwesomeIcon icon={faTags} /> Tags & Tech Stack
                        </div>

                        <div className="wmx-add-field">
                            <label className="wmx-add-label">Tags</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faTags} /></span>
                                <input className="wmx-add-input" type="text" name="tags" placeholder="ecommerce, landing-page, dashboard"
                                    value={products.tags} onChange={onchange} />
                                {products.tags.length > 0 && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, tags: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                            <span className="wmx-hint">Separate with commas</span>
                        </div>

                        <div className="wmx-add-field">
                            <label className="wmx-add-label">Built With</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faWrench} /></span>
                                <input className="wmx-add-input" type="text" name="builtWith" placeholder="React, Node.js, MongoDB"
                                    value={products.builtWith} onChange={onchange} />
                                {products.builtWith.length > 0 && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, builtWith: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                            <span className="wmx-hint">Separate with commas</span>
                        </div>

                        <div className="wmx-add-field" style={{ marginBottom: 0 }}>
                            <label className="wmx-add-label">Features</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faList} /></span>
                                <input className="wmx-add-input" type="text" name="features" placeholder="Responsive, Dark mode, Auth included"
                                    value={products.features} onChange={onchange} />
                                {products.features.length > 0 && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, features: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                            <span className="wmx-hint">Separate with commas</span>
                        </div>
                    </div>

                    {/* ── Section 5: Support ── */}
                    <div className="wmx-add-section">
                        <div className="wmx-add-section-title">
                            <FontAwesomeIcon icon={faHeadset} /> Support & Docs
                        </div>

                        <div className="wmx-add-field">
                            <label className="wmx-add-label">Support Duration</label>
                            <div className="wmx-add-input-wrap">
                                <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faHeadset} /></span>
                                <input className="wmx-add-input" type="text" name="support" placeholder="6 months, Lifetime, None"
                                    value={products.support} onChange={onchange} />
                                {products.support && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, support: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                            </div>
                        </div>

                        <label className="wmx-checkbox-row" style={{ marginBottom: 0 }}>
                            <input
                                type="checkbox"
                                className="wmx-checkbox"
                                checked={products.documentation}
                                onChange={e => setproducts(p => ({ ...p, documentation: e.target.checked }))}
                            />
                            <div>
                                <div className="wmx-checkbox-label">Documentation Included</div>
                                <div style={{ fontSize: '0.68rem', color: '#3a3a4a', marginTop: 2 }}>Check if this product comes with written documentation</div>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="wmx-submit" onClick={handleClick}>
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        Publish Product
                    </button>

                </div>
            </div>
        </>
    );
}

export default AddProducts;