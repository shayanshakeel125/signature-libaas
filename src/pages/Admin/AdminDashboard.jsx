import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, matchCategory } from '../../context/ProductsContext';
import { useSettings } from '../../context/SettingsContext';

const AdminDashboard = () => {
  const { products, categories } = useProducts();
  const { settings } = useSettings();

  const orders = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + (Number(o.totalNumber) || 0), 0);
    const tshirtCount = products.filter(p => matchCategory(p, 'tshirts')).length;
    const kurtiCount = products.filter(p => matchCategory(p, 'kurtis')).length;
    const badged = products.filter(p => p.badge).length;
    const pending = orders.filter(o => o.status === 'Pending').length;

    return { revenue, tshirtCount, kurtiCount, badged, pending };
  }, [products, orders]);

  const recentOrders = orders.slice(0, 5);

  const statCards = [
    { label: 'Total Products', value: products.length, icon: '📦', link: '/admin/products', accent: 'gold' },
    { label: 'Categories', value: categories.length, icon: '🗂️', link: '/admin/categories', accent: 'red' },
    { label: 'Total Orders', value: orders.length, icon: '🧾', link: '/admin/orders', accent: 'gold' },
    { label: 'Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, icon: '💰', link: '/admin/orders', accent: 'red' }
  ];

  return (
    <div className="admin-page">
      {/* ===== STAT CARDS ===== */}
      <div className="admin-stat-grid">
        {statCards.map(card => (
          <Link to={card.link} key={card.label} className={`admin-stat-card ${card.accent}`}>
            <span className="admin-stat-icon">{card.icon}</span>
            <div className="admin-stat-body">
              <span className="admin-stat-value">{card.value}</span>
              <span className="admin-stat-label">{card.label}</span>
            </div>
            <span className="admin-stat-arrow">→</span>
          </Link>
        ))}
      </div>

      <div className="admin-grid-2">
        {/* ===== PRODUCT BREAKDOWN ===== */}
        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Products by Category</h2>
            <Link to="/admin/products" className="admin-link">Manage →</Link>
          </header>
          <div className="admin-breakdown">
            {categories.map(cat => {
              const count = products.filter(p => matchCategory(p, cat)).length;
              const percent = products.length ? Math.round((count / products.length) * 100) : 0;
              return (
                <div className="admin-breakdown-row" key={cat}>
                  <div className="admin-breakdown-info">
                    <span>{cat}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="admin-progress">
                    <div className="admin-progress-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="admin-mini-stats">
            <div><strong>{stats.badged}</strong><span>With Badge</span></div>
            <div><strong>{stats.tshirtCount}</strong><span>T-Shirts</span></div>
            <div><strong>{stats.kurtiCount}</strong><span>Kurtis</span></div>
            <div><strong>{stats.pending}</strong><span>Pending Orders</span></div>
          </div>
        </section>

        {/* ===== RECENT ORDERS ===== */}
        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="admin-link">View all →</Link>
          </header>

          {recentOrders.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty-icon">🧾</span>
              <h3>No orders yet</h3>
              <p>Orders placed from checkout will appear here.</p>
            </div>
          ) : (
            <div className="admin-order-list">
              {recentOrders.map(order => (
                <div className="admin-order-row" key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <small>{order.customer?.name || 'Customer'}</small>
                  </div>
                  <div className="admin-order-meta">
                    <span className="admin-order-total">{order.total}</span>
                    <span className={`admin-status-chip ${String(order.status || '').toLowerCase()}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <section className="admin-card">
        <header className="admin-card-header">
          <h2>Quick Actions</h2>
        </header>
        <div className="admin-quick-actions">
          <Link to="/admin/products" className="admin-btn admin-btn-gradient">＋ Add Product</Link>
          <Link to="/admin/categories" className="admin-btn admin-btn-outline">＋ Add Category</Link>
          <Link to="/admin/settings" className="admin-btn admin-btn-outline">⚙️ Site Settings</Link>
          <Link to="/" className="admin-btn admin-btn-outline">🌐 View Storefront</Link>
        </div>
        <p className="admin-hint">
          Signed in as <strong>Administrator</strong> · Store: <strong>{settings.brandName}</strong> ·
          Theme settings, logo and hero slides are managed under Site Settings.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboard;
