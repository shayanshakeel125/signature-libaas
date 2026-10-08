import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, matchCategory } from '../../context/ProductsContext';
import { showToast } from '../../components/Toaster';

const CATEGORY_ICONS = ['👕', '👗', '🧥', '👖', '👟', '👜'];

const AdminCategories = () => {
  const { products, categories, addCategory, deleteCategory } = useProducts();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) {
      setError('Category name is required.');
      return;
    }
    if (clean.length < 3) {
      setError('Category name must be at least 3 characters.');
      return;
    }
    const result = addCategory(clean);
    if (!result.success) {
      setError(result.error);
      showToast(result.error, 'error');
      return;
    }
    showToast(`Category "${clean}" added.`, 'success');
    setName('');
    setError('');
  };

  const handleDelete = (cat) => {
    const result = deleteCategory(cat);
    if (!result.success) {
      showToast(result.error, 'error');
      return;
    }
    showToast(`Category "${cat}" deleted.`, 'success');
  };

  return (
    <div className="admin-page">
      {/* ===== ADD CATEGORY ===== */}
      <section className="admin-card">
        <header className="admin-card-header">
          <h2>Add New Category</h2>
        </header>
        <form className="admin-inline-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-field">
            <label htmlFor="cat-name">Category Name</label>
            <input
              id="cat-name"
              type="text"
              placeholder="e.g. Hoodies"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className={error ? 'invalid' : ''}
            />
            {error && <small className="admin-field-error">{error}</small>}
          </div>
          <button type="submit" className="admin-btn admin-btn-gradient">＋ Add Category</button>
        </form>
      </section>

      {/* ===== CATEGORY LIST ===== */}
      <section className="admin-card">
        <header className="admin-card-header">
          <h2>All Categories</h2>
          <span className="admin-count-chip">{categories.length}</span>
        </header>

        <div className="admin-category-grid">
          {categories.map((cat, i) => {
            const count = products.filter(p => matchCategory(p, cat)).length;
            return (
              <div className="admin-category-card" key={cat}>
                <span className="admin-category-icon">{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</span>
                <div className="admin-category-info">
                  <strong>{cat}</strong>
                  <small>{count} product{count === 1 ? '' : 's'}</small>
                </div>
                <div className="admin-category-actions">
                  <Link to="/admin/products" className="admin-mini-btn" title="View products">View</Link>
                  <button
                    className="admin-mini-btn danger"
                    title="Delete category"
                    onClick={() => handleDelete(cat)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="admin-empty">
            <span className="admin-empty-icon">🗂️</span>
            <h3>No categories yet</h3>
            <p>Add your first category above.</p>
          </div>
        )}
      </section>

      <p className="admin-hint">
        Categories that contain products can't be deleted — move or delete those products first.
      </p>
    </div>
  );
};

export default AdminCategories;
