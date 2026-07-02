import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const EditProductModal = ({ product, onClose, onSave }) => {
  const DEFAULT_LICENSE_TEXT = 'This product is sold under Regular License. You can use it in one personal or client project. Reselling or redistributing is strictly prohibited.';

  const [form, setForm] = useState({
    title: product.title || '',
    description: product.description || '',
    price: String(product.price ?? ''),
    livePreviewUrl: product.livePreviewUrl || '',
    tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
    builtWith: Array.isArray(product.builtWith) ? product.builtWith.join(', ') : (product.builtWith || ''),
    features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''),
    support: product.support || '',
    documentation: !!product.documentation,
    license: product.license || DEFAULT_LICENSE_TEXT,
    whatsappNumber: product.whatsappNumber || '',
  });

  // { type: 'existing', url } | { type: 'new', file, preview }
  const [images, setImages] = useState(
    (product.images || []).map(url => ({ type: 'existing', url }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const addNewImages = (files) => {
    const newImgs = Array.from(files).map(file => ({
      type: 'new', file, preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImgs]);
  };

  const removeImage = (idx) => {
    setImages(prev => {
      const img = prev[idx];
      if (img.type === 'new') URL.revokeObjectURL(img.preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: 'POST', body: fd }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.description.trim()) { setError('Description is required'); return; }
    if (!form.price) { setError('Price is required'); return; }

    setError('');
    setSaving(true);

    try {
      const finalImages = [];
      for (const img of images) {
        if (img.type === 'existing') {
          finalImages.push(img.url);
        } else {
          const url = await uploadToCloudinary(img.file);
          finalImages.push(url);
        }
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price,
        livePreviewUrl: form.livePreviewUrl.trim(),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        builtWith: form.builtWith ? form.builtWith.split(',').map(t => t.trim()).filter(Boolean) : [],
        features: form.features ? form.features.split(',').map(t => t.trim()).filter(Boolean) : [],
        support: form.support.trim(),
        documentation: form.documentation,
        images: finalImages,
        license: form.license,
        whatsappNumber: form.whatsappNumber.trim(),
      };

      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/update/${product._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', token },
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      const json = await res.json();

      if (res.ok) {
        onSave({ ...product, ...payload });
      } else {
        setError(json.message || json.error || 'Failed to update product');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="wmx-modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="wmx-edit-product-modal">
        <div className="wmx-modal-hd">
          <span>Edit Product</span>
          <button className="wmx-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="wmx-modal-body">

          <div className="wmx-modal-field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" />
          </div>

          <div className="wmx-modal-field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your product..." />
          </div>

          <div className="wmx-modal-row">
            <div className="wmx-modal-field">
              <label>Price (USD)</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder='29 or "Free"' />
            </div>
            <div className="wmx-modal-field">
              <label>Live Preview URL</label>
              <input name="livePreviewUrl" value={form.livePreviewUrl} onChange={handleChange} placeholder="https://demo.example.com" />
            </div>
          </div>

          <div className="wmx-modal-field">
            <label>Tags <span className="wmx-modal-hint">comma-separated</span></label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="ecommerce, landing-page, dashboard" />
          </div>

          <div className="wmx-modal-row">
            <div className="wmx-modal-field">
              <label>Built With <span className="wmx-modal-hint">comma-separated</span></label>
              <input name="builtWith" value={form.builtWith} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="wmx-modal-field">
              <label>Features <span className="wmx-modal-hint">comma-separated</span></label>
              <input name="features" value={form.features} onChange={handleChange} placeholder="Dark mode, Auth included" />
            </div>
          </div>

          <div className="wmx-modal-row">
            <div className="wmx-modal-field">
              <label>Support Duration</label>
              <input name="support" value={form.support} onChange={handleChange} placeholder="6 months, Lifetime, None" />
            </div>
            <div className="wmx-modal-field">
              <label>Documentation</label>
              <label className="wmx-epm-check-row">
                <input
                  type="checkbox"
                  className="wmx-epm-checkbox"
                  name="documentation"
                  checked={form.documentation}
                  onChange={handleChange}
                />
                <span className="wmx-epm-check-label">Documentation included</span>
              </label>
            </div>
          </div>

          <div className="wmx-modal-field">
            <label>WhatsApp Number</label>
            <input
              type="tel"
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              placeholder="e.g. +8801XXXXXXXXX"
            />
          </div>

          <div className="wmx-modal-section-title" style={{ marginTop: 8 }}>License Terms</div>
          <div className="wmx-modal-field">
            <label>License Text</label>
            <textarea
              name="license"
              value={form.license}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the license terms..."
            />
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

          <div className="wmx-modal-section-title" style={{ marginTop: 4 }}>Images</div>

          {images.length > 0 && (
            <div className="wmx-epm-img-grid">
              {images.map((img, i) => (
                <div key={i} className="wmx-epm-img-item">
                  <img
                    src={img.type === 'existing' ? img.url : img.preview}
                    alt={`img-${i}`}
                  />
                  <button
                    type="button"
                    className="wmx-epm-img-remove"
                    onClick={() => removeImage(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            className={`wmx-epm-upload-zone${dragOver ? ' drag' : ''}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              addNewImages(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={e => addNewImages(e.target.files)}
            />
            <Upload size={18} style={{ color: 'var(--accent)', marginBottom: 4 }} />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Click or drag to add images
            </div>
          </div>

          {error && <div className="wmx-modal-error">{error}</div>}
        </div>

        <div className="wmx-modal-ft">
          <button className="wmx-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="wmx-modal-save" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
