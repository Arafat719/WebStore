import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import userContext from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faCloudArrowUp, faPlus, faCode, faLink, faDollarSign,
    faTags, faWrench, faList, faHeadset, faGlobe, faBoxOpen,
    faEye, faEyeSlash, faCheck, faCircleNotch, faLock, faPen,
    faStar, faFile, faClock, faKey, faCodeBranch, faFileLines,
    faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import '../css/AddProducts.css';

function AddProducts({ showAlert }) {
    const [termsChecked, setTermsChecked] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);

    const [githubUrl, setGithubUrl] = useState("");
    const [repoPat, setRepoPat] = useState("");
    const [showPat, setShowPat] = useState(false);
    const [githubStatus, setGithubStatus] = useState(null);
    // null | 'verifying' | { ok: true, data: {...} } | { error: 'string' }
    const [githubLocked, setGithubLocked] = useState(false);

    const [dragOver, setDragOver] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const navigate = useNavigate();
    const context = useContext(userContext);
    const { addProducts } = context;

    const DEFAULT_LICENSE_TEXT = 'This product is sold under Regular License. You can use it in one personal or client project. Reselling or redistributing is strictly prohibited.';

    const [products, setproducts] = useState({
        title: "", images: [""], description: "", price: "", category: "",
        previewLink: "", livePreviewUrl: "", tags: "", builtWith: "", features: "",
        documentation: false, support: "", license: DEFAULT_LICENSE_TEXT,
    });

    const isGithubVerified = githubStatus?.ok === true;
    const isAuthenticated = !!localStorage.getItem("token");

    const validateForm = () => {
        if (!isGithubVerified) {
            showAlert("Please verify your GitHub repository first", "error");
            return false;
        }
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
        if (!products.category) {
            showAlert("Please select a category", "error");
            return false;
        }
        if (products.images.filter(i => i?.preview).length === 0) {
            showAlert("At least one image is required", "error");
            return false;
        }
        return true;
    };

    const verifyGithub = async () => {
        const trimmedUrl = githubUrl.trim();
        const trimmedPat = repoPat.trim();

        if (!trimmedUrl) { showAlert("Please enter a GitHub repo URL", "error"); return; }
        if (!trimmedPat) { showAlert("Please enter your Personal Access Token", "error"); return; }

        let owner, repo;
        try {
            const url = new URL(trimmedUrl);
            const parts = url.pathname.split('/').filter(Boolean);
            if (parts.length < 2) throw new Error();
            owner = parts[0];
            repo = parts[1].replace('.git', '');
        } catch {
            setGithubStatus({ error: 'Invalid GitHub URL format.' });
            return;
        }

        setGithubStatus('verifying');

        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: {
                    Authorization: `token ${trimmedPat}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            if (res.status === 401) {
                setGithubStatus({ error: 'Invalid PAT. Please check your Personal Access Token.' });
                return;
            }
            if (res.status === 404) {
                setGithubStatus({ error: 'Repository not found. Make sure the URL is correct and the token has access.' });
                return;
            }
            if (!res.ok) {
                setGithubStatus({ error: 'Something went wrong. Please try again.' });
                return;
            }

            const data = await res.json();

            if (!data.permissions?.push) {
                setGithubStatus({ error: "You don't have sufficient access to this repository." });
                return;
            }
            let lastCommit = null;
            try {
                const cRes = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
                    { headers: { Authorization: `token ${trimmedPat}`, Accept: 'application/vnd.github.v3+json' } }
                );
                const commits = await cRes.json();
                lastCommit = commits[0]?.commit?.author?.date ?? null;
            } catch {}

            let fileCount = '?';
            try {
                const tRes = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
                    { headers: { Authorization: `token ${trimmedPat}`, Accept: 'application/vnd.github.v3+json' } }
                );
                const tree = await tRes.json();
                fileCount = tree.tree?.filter(i => i.type === 'blob').length ?? '?';
            } catch {}

            if (fileCount === 0) {
                setGithubStatus({ error: 'This repository has no code. Please submit a project with actual files.' });
                return;
            }

            setGithubStatus({
                ok: true,
                data: {
                    name: data.name,
                    language: data.language ?? 'Unknown',
                    stars: data.stargazers_count ?? 0,
                    fileCount,
                    lastCommit,
                }
            });
            setGithubLocked(true);

        } catch {
            setGithubStatus({ error: 'Something went wrong. Please try again.' });
        }
    };

    const handleChangeRepo = () => {
        setGithubLocked(false);
        setGithubStatus(null);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setPublishing(true);

        const handleUpload = async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: formData });
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

        const result = await addProducts(
            finalData.images, finalData.title, finalData.description, finalData.price,
            finalData.previewLink, finalData.tags, finalData.builtWith, finalData.features,
            finalData.support, finalData.documentation, githubUrl, repoPat, finalData.livePreviewUrl,
            finalData.license, finalData.category
        );

        if (result?.success) {
            setRepoPat("");
            setPublishing(false);
            const targetPath = `/product/${result.productId}`;
            showAlert(result.message, "success", () => navigate(targetPath));
            setTimeout(() => {
                navigate(targetPath);
            }, 5000);
            return;
        } else if (result?.message) {
            showAlert(result.message, "error");
        }
        setPublishing(false);
    };

    const onchange = (e) => setproducts({ ...products, [e.target.name]: e.target.value });

    const addImages = (files) => {
        const newImages = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
        setproducts(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) showAlert("To Add website You must be Logged in with us", "warning");
    }, []);

    if (isAuthenticated && !termsAgreed) {
        return (
            <div className="wmx-terms-overlay">
                <div className="wmx-terms-modal">
                    <div className="wmx-add-eyebrow" style={{ marginBottom: 14 }}>
                        <span className="wmx-add-dot" />
                        Before You List
                    </div>
                    <h2 className="wmx-terms-title">Terms & <span>Conditions</span></h2>
                    <p className="wmx-terms-subtitle">Please read and accept these terms to continue.</p>
                    <ul className="wmx-terms-list">
                        <li>
                            <span className="wmx-terms-num">01</span>
                            Only real, working, and original code is allowed on this platform.
                        </li>
                        <li>
                            <span className="wmx-terms-num">02</span>
                            Fake, copied, or non-functional products will result in a <strong>permanent account ban</strong>.
                        </li>
                        <li>
                            <span className="wmx-terms-num">03</span>
                            You must own or have full rights to the repository you submit.
                        </li>
                        <li>
                            <span className="wmx-terms-num">04</span>
                            If a buyer requests customization of a purchased product, the seller is obligated to complete those changes <strong>before payment is released</strong>.
                        </li>
                        <li>
                            <span className="wmx-terms-num">05</span>
                            WebMarketX reserves the right to remove any product that violates these terms.
                        </li>
                        <li>
                            <span className="wmx-terms-num">06</span>
                            By listing a product, you agree that WebMarketX may store a copy of your repository for delivery purposes.
                        </li>
                        <li>
                            <span className="wmx-terms-num">07</span>
                            Include a <code>.env.example</code> file in your repository so buyers know which environment variables are required to run the project.
                        </li>
                        <li>
                            <span className="wmx-terms-num">08</span>
                            WebMarketX is not responsible for any sensitive information (API keys, passwords, secrets) that you accidentally include in your repository. You are solely responsible for reviewing your code before submission. By listing a product, you release WebMarketX from any liability arising from such disclosures.
                        </li>
                    </ul>
                    <div className="wmx-terms-footer">
                        <label className="wmx-terms-check-row">
                            <input
                                type="checkbox"
                                className="wmx-checkbox"
                                checked={termsChecked}
                                onChange={e => setTermsChecked(e.target.checked)}
                            />
                            <span className="wmx-terms-check-label">I have read and agree to the Terms & Conditions</span>
                        </label>
                        <button
                            className="wmx-terms-btn"
                            disabled={!termsChecked}
                            onClick={() => setTermsAgreed(true)}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                            Continue to Listing
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
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

                {/* ── Section 1: GitHub Repository ── */}
                <div className="wmx-add-section">
                    <div className="wmx-add-section-title">
                        <FontAwesomeIcon icon={faCodeBranch} /> GitHub Repository
                    </div>

                    <div className="wmx-add-field">
                        <label className="wmx-add-label">GitHub Repository URL</label>
                        <div className="wmx-add-input-wrap">
                            <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faLink} /></span>
                            <input
                                className="wmx-add-input"
                                type="url"
                                placeholder="https://github.com/username/repo"
                                value={githubUrl}
                                onChange={e => { if (!githubLocked) { setGithubUrl(e.target.value); setGithubStatus(null); } }}
                                readOnly={githubLocked}
                            />
                            {githubUrl && !githubLocked && (
                                <button className="wmx-clear-btn" type="button" onClick={() => { setGithubUrl(""); setGithubStatus(null); }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            )}
                            {githubLocked && <span className="wmx-field-locked"><FontAwesomeIcon icon={faLock} /></span>}
                        </div>
                    </div>

                    <div className="wmx-add-field">
                        <label className="wmx-add-label">Personal Access Token (PAT)</label>
                        <div className="wmx-add-input-wrap">
                            <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faKey} /></span>
                            <input
                                className="wmx-add-input"
                                type={showPat ? "text" : "password"}
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                value={repoPat}
                                onChange={e => { if (!githubLocked) { setRepoPat(e.target.value); setGithubStatus(null); } }}
                                readOnly={githubLocked}
                                autoComplete="off"
                            />
                            <button className="wmx-pat-toggle" type="button" onClick={() => setShowPat(v => !v)} tabIndex={-1}>
                                <FontAwesomeIcon icon={showPat ? faEyeSlash : faEye} />
                            </button>
                            {githubLocked && <span className="wmx-field-locked"><FontAwesomeIcon icon={faLock} /></span>}
                        </div>
                        <span className="wmx-hint">
                            Needs <code>repo</code> scope.{' '}
                            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="wmx-hint-link">
                                Generate a token →
                            </a>
                        </span>
                    </div>

                    {!githubLocked ? (
                        <button
                            type="button"
                            className="wmx-verify-btn"
                            onClick={verifyGithub}
                            disabled={githubStatus === 'verifying'}
                        >
                            {githubStatus === 'verifying' ? (
                                <><FontAwesomeIcon icon={faCircleNotch} spin /> Verifying...</>
                            ) : (
                                <><FontAwesomeIcon icon={faCodeBranch} /> Verify & Connect Repository</>
                            )}
                        </button>
                    ) : (
                        <button type="button" className="wmx-change-repo-btn" onClick={handleChangeRepo}>
                            <FontAwesomeIcon icon={faPen} /> Change Repository
                        </button>
                    )}

                    <div className="wmx-repo-info-box">
                        <div className="wmx-repo-info-icon">
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </div>
                        <div className="wmx-repo-info-text">
                            <p className="wmx-repo-info-title">Before you submit</p>
                            <ul className="wmx-repo-info-list">
                                <li>Make sure your repo does <strong>not</strong> contain any <code>.env</code> files with real secrets — these will be automatically removed, but double-check anyway.</li>
                                <li>Include a <code>.env.example</code> file listing all required environment variables (without real values) so buyers can set up the project easily.</li>
                                <li>WebMarketX is not liable for any sensitive data you accidentally expose in your repository.</li>
                            </ul>
                        </div>
                    </div>

                    {githubStatus === 'verifying' && (
                        <div className="wmx-github-status wmx-github-status--loading">
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                            <span>Verifying repository...</span>
                        </div>
                    )}
                    {githubStatus?.error && (
                        <div className="wmx-github-status wmx-github-status--error">
                            {githubStatus.error}
                        </div>
                    )}
                    {githubStatus?.ok && (
                        <div className="wmx-github-status wmx-github-status--success">
                            <div className="wmx-github-status-header">
                                <FontAwesomeIcon icon={faCheck} className="wmx-github-check-icon" />
                                <span className="wmx-github-repo-name">{githubStatus.data.name}</span>
                            </div>
                            <div className="wmx-github-info-grid">
                                <div className="wmx-github-info-item">
                                    <FontAwesomeIcon icon={faCode} />
                                    <span>{githubStatus.data.language}</span>
                                </div>
                                <div className="wmx-github-info-item">
                                    <FontAwesomeIcon icon={faFile} />
                                    <span>{githubStatus.data.fileCount} files</span>
                                </div>
                                <div className="wmx-github-info-item">
                                    <FontAwesomeIcon icon={faStar} />
                                    <span>{githubStatus.data.stars} stars</span>
                                </div>
                                <div className="wmx-github-info-item">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span>Last commit: {formatDate(githubStatus.data.lastCommit)}</span>
                                </div>
                            </div>
                        </div>
                    )}
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

                {/* ── Section 3: Product Details ── */}
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

                    <div className="wmx-add-field">
                        <label className="wmx-add-label">Category</label>
                        <div className="wmx-add-input-wrap">
                            <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faList} /></span>
                            <select className="wmx-add-input" name="category" value={products.category} onChange={onchange}>
                                <option value="" disabled>Select a category</option>
                                <option value="Templates">Templates</option>
                                <option value="Websites">Websites</option>
                                <option value="Businesses">Businesses</option>
                            </select>
                        </div>
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

                    <div className="wmx-add-field" style={{ marginBottom: 0, marginTop: 12 }}>
                        <label className="wmx-add-label">Live Preview URL (optional)</label>
                        <div className="wmx-add-input-wrap">
                            <span className="wmx-add-input-icon"><FontAwesomeIcon icon={faGlobe} /></span>
                            <input className="wmx-add-input" type="url" name="livePreviewUrl" placeholder="https://your-demo-site.com"
                                value={products.livePreviewUrl} onChange={onchange} />
                            {products.livePreviewUrl && <button className="wmx-clear-btn" type="button" onClick={() => setproducts(p => ({ ...p, livePreviewUrl: "" }))}><FontAwesomeIcon icon={faTimes} /></button>}
                        </div>
                    </div>
                </div>

                {/* ── Section 4: Tags & Tech Stack ── */}
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

                {/* ── Section 5: Support & Docs ── */}
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

                {/* ── Section 6: License ── */}
                <div className="wmx-add-section">
                    <div className="wmx-add-section-title">
                        <FontAwesomeIcon icon={faFileLines} /> License Terms
                    </div>
                    <div className="wmx-add-field" style={{ marginBottom: 0 }}>
                        <label className="wmx-add-label">License Text</label>
                        <textarea
                            className="wmx-add-textarea wmx-license-textarea"
                            name="license"
                            value={products.license}
                            onChange={onchange}
                            rows={4}
                            placeholder="Describe the license terms for this product..."
                        />
                        <span className="wmx-hint">Buyers will see this on the product page. You can customize it.</span>
                    </div>
                    <div className="wmx-custom-terms-notice">
                        <div className="wmx-custom-terms-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <div className="wmx-custom-terms-text">
                            <strong>Customization Request Policy</strong>
                            <p>
                                By listing this product, you agree that if a buyer sends a customization request and you do not respond within <strong>30 minutes</strong>, WebMarketX team reserves the right to handle the request on your behalf. Ensure your contact email is up to date.
                            </p>
                        </div>
                    </div>
                </div>

                <button type="submit" className="wmx-submit" onClick={handleClick} disabled={publishing}>
                    {publishing ? (
                        <>
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                            Publishing... Please wait
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faCloudArrowUp} />
                            Publish Product
                        </>
                    )}
                </button>

            </div>
        </div>
    );
}

export default AddProducts;
