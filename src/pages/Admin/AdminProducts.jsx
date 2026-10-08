import React, { useState, useMemo, useRef } from 'react';
import { useProducts, matchCategory } from '../../context/ProductsContext';
import { showToast } from '../../components/Toaster';

const EMPTY_FORM = {
  name: '',
  price: '',
  description: '',
  category: 'T-Shirts',
  sizes: ['S', 'M', 'L', 'XL'],
  badge: '',
  images: []
};

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const BADGE_SUGGESTIONS = ['New', 'Sale', 'Best Seller', 'Trending'];

// "1299" / "Rs. 1299" / "Rs. 1,299" → "Rs. 1,299"
const formatPrice = (value) => {
  const digits = String(value).replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `Rs. ${Number(digits).toLocaleString('en-IN')}`;
};

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // product id | null
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [urlInput, setUrlInput] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        String(p.price).toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') {
      list = list.filter(p => matchCategory(p, filterCategory));
    }
    return list;
  }, [products, search, filterCategory]);

  /* ---------- form helpers ---------- */
  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, category: categories[0] || 'T-Shirts' });
    setErrors({});
    setUrlInput('');
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category,
      sizes: product.sizes?.length ? [...product.sizes] : [],
      badge: product.badge || '',
      images: product.images ? [...product.images] : []
    });
    setErrors({});
    setUrlInput('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
    setErrors(prev => ({ ...prev, sizes: '' }));
  };

  /* ---------- images ---------- */
  const addImageUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!/^https?:\/\/.+/i.test(url) && !url.startsWith('data:image/')) {
      setErrors(prev => ({ ...prev, images: 'Enter a valid image URL (https://…).' }));
      return;
    }
    setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    setUrlInput('');
    setErrors(prev => ({ ...prev, images: '' }));
  };

  // FileReader → base64
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed.', 'error');
        return;
      }
      if (file.size > 1.5 * 1024 * 1024) {
        showToast(`"${file.name}" is too large (max 1.5MB). Use a URL instead.`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.onerror = () => showToast('Could not read that file.', 'error');
      reader.readAsDataURL(file);
    });

    setErrors(prev => ({ ...prev, images: '' }));
    e.target.value = '';
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  /* ---------- validation + submit ---------- */
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    else if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';

    if (!String(form.price).trim()) errs.price = 'Price is required.';
    else if (!/\d/.test(String(form.price))) errs.price = 'Price must contain a number.';

    if (!form.description.trim()) errs.description = 'Description is required.';
    else if (form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters.';

    if (!form.category.trim()) errs.category = 'Category is required.';
    if (!form.sizes.length) errs.sizes = 'Select at least one size.';
    if (!form.images.length) errs.images = 'Add at least one image (URL or upload).';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: formatPrice(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      sizes: form.sizes,
      badge: form.badge.trim() || null,
      images: form.images
    };

    if (editing) {
      updateProduct(editing, payload);
      showToast('Product updated successfully.', 'success');
    } else {
      addProduct(payload);
      showToast('Product created successfully.', 'success');
    }
    closeForm();
  };

  /* ---------- delete ---------- */
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    showToast(`"${deleteTarget.name}" deleted.`, 'success');
    setDeleteTarget(null);
  };

  return (
    <div className="admin-page">
      {/* ===== TOOLBAR ===== */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <input
            type="search"
            className="admin-search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="admin-btn admin-btn-gradient" onClick={openCreate}>＋ Add Product</button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="admin-card admin-table-card">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">📦</span>
            <h3>No products found</h3>
            <p>{products.length === 0 ? 'Create your first product to get started.' : 'Try a different search or filter.'}</p>
            {products.length === 0 && (
              <button className="admin-btn admin-btn-gradient" onClick={openCreate}>＋ Add Product</button>
            )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Badge</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        className="admin-table-img"
                        src={product.images?.[0]}
                        alt={product.name}
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="admin-table-name">
                        <strong>{product.name}</strong>
                        <small>#{product.id}</small>
                      </div>
                    </td>
                    <td className="td-price">{product.price}</td>
                    <td><span className="admin-cat-chip">{product.category}</span></td>
                    <td>
                      {product.badge
                        ? <span className="admin-badge-chip">{product.badge}</span>
                        : <span className="admin-no-badge">—</span>}
                    </td>
                    <td className="td-actions">
                      <div className="admin-actions-cell">
                        <button className="admin-icon-action edit" title="Edit" onClick={() => openEdit(product)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="admin-icon-action delete" title="Delete" onClick={() => setDeleteTarget(product)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="admin-hint">
        Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products ·
        changes are saved to localStorage (<code>signature_products</code>) and appear on the store instantly.
      </p>

      {/* ===== CREATE / EDIT MODAL ===== */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={closeForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <header className="admin-modal-header">
              <h2>{editing ? 'Edit Product' : 'Create New Product'}</h2>
              <button className="admin-modal-close" onClick={closeForm} aria-label="Close">✕</button>
            </header>

            <form className="admin-form admin-form-scroll" onSubmit={handleSubmit} noValidate>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Premium Cotton Tee"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? 'invalid' : ''}
                  />
                  {errors.name && <small className="admin-field-error">{errors.name}</small>}
                </div>

                <div className="admin-field">
                  <label>Price *</label>
                  <input
                    type="text"
                    name="price"
                    placeholder="Rs. 1,299 or 1299"
                    value={form.price}
                    onChange={handleChange}
                    className={errors.price ? 'invalid' : ''}
                  />
                  {errors.price && <small className="admin-field-error">{errors.price}</small>}
                </div>
              </div>

              <div className="admin-field">
                <label>Description *</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Product description…"
                  value={form.description}
                  onChange={handleChange}
                  className={errors.description ? 'invalid' : ''}
                />
                {errors.description && <small className="admin-field-error">{errors.description}</small>}
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={errors.category ? 'invalid' : ''}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <small className="admin-field-error">{errors.category}</small>}
                </div>

                <div className="admin-field">
                  <label>Badge</label>
                  <input
                    type="text"
                    name="badge"
                    placeholder="Leave empty for no badge"
                    value={form.badge}
                    onChange={handleChange}
                    list="badge-suggestions"
                  />
                  <datalist id="badge-suggestions">
                    {BADGE_SUGGESTIONS.map(b => <option key={b} value={b} />)}
                  </datalist>
                </div>
              </div>

              <div className="admin-field">
                <label>Sizes * <span className="admin-label-hint">(click to toggle)</span></label>
                <div className="admin-size-picker">
                  {ALL_SIZES.map(size => (
                    <button
                      type="button"
                      key={size}
                      className={`admin-size-chip ${form.sizes.includes(size) ? 'active' : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.sizes && <small className="admin-field-error">{errors.sizes}</small>}
              </div>

              <div className="admin-field">
                <label>Images * <span className="admin-label-hint">(first image = main)</span></label>

                <div className="admin-image-actions">
                  <input
                    type="url"
                    className="admin-url-input"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => { setUrlInput(e.target.value); setErrors(prev => ({ ...prev, images: '' })); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }}
                  />
                  <button type="button" className="admin-btn admin-btn-outline" onClick={addImageUrl}>Add URL</button>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => fileInputRef.current?.click()}>
                    📤 Upload
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
                </div>

                {form.images.length > 0 ? (
                  <div className="admin-image-previews">
                    {form.images.map((src, i) => (
                      <div className="admin-image-thumb" key={i}>
                        <img src={src} alt={`preview ${i + 1}`} />
                        {i === 0 && <span className="admin-thumb-main">MAIN</span>}
                        <button type="button" onClick={() => removeImage(i)} aria-label="Remove image">✕</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="admin-image-empty">No images added yet</div>
                )}
                {errors.images && <small className="admin-field-error">{errors.images}</small>}
              </div>

              <footer className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={closeForm}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-gradient">
                  {editing ? 'Save Changes' : 'Create Product'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <header className="admin-modal-header">
              <h2>Delete Product?</h2>
              <button className="admin-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Close">✕</button>
            </header>
            <div className="admin-confirm-body">
              <img src={deleteTarget.images?.[0]} alt={deleteTarget.name} />
              <p>
                You're about to permanently delete <strong>“{deleteTarget.name}”</strong>.
                It will disappear from the store immediately. This cannot be undone.
              </p>
            </div>
            <footer className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
