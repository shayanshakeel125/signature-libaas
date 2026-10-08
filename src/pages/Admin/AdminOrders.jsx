import React, { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered'];

const AdminOrders = () => {
  const { settings } = useSettings();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const orders = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }, []);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== 'All') {
      list = list.filter(o => String(o.status || 'Pending') === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o.id).toLowerCase().includes(q) ||
        String(o.customer?.name || '').toLowerCase().includes(q) ||
        String(o.customer?.email || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  const revenue = orders.reduce((sum, o) => sum + (Number(o.totalNumber) || 0), 0);
  const pendingCount = orders.filter(o => (o.status || 'Pending') === 'Pending').length;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="admin-page">
      {/* ===== SUMMARY ===== */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card gold">
          <span className="admin-stat-icon">🧾</span>
          <div className="admin-stat-body">
            <span className="admin-stat-value">{orders.length}</span>
            <span className="admin-stat-label">Total Orders</span>
          </div>
        </div>
        <div className="admin-stat-card red">
          <span className="admin-stat-icon">💰</span>
          <div className="admin-stat-body">
            <span className="admin-stat-value">Rs. {revenue.toLocaleString()}</span>
            <span className="admin-stat-label">Total Revenue</span>
          </div>
        </div>
        <div className="admin-stat-card gold">
          <span className="admin-stat-icon">⏳</span>
          <div className="admin-stat-body">
            <span className="admin-stat-value">{pendingCount}</span>
            <span className="admin-stat-label">Pending</span>
          </div>
        </div>
        <div className="admin-stat-card red">
          <span className="admin-stat-icon">📦</span>
          <div className="admin-stat-body">
            <span className="admin-stat-value">{orders.length - pendingCount}</span>
            <span className="admin-stat-label">Processed</span>
          </div>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-filters">
          <input
            type="search"
            className="admin-search"
            placeholder="Search by order ID, name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
        <span className="admin-count-chip">{filtered.length} orders</span>
      </div>

      {/* ===== ORDERS TABLE (read-only) ===== */}
      <div className="admin-card admin-table-card">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">🧾</span>
            <h3>No orders found</h3>
            <p>Orders placed on the storefront ({settings.brandName}) will be listed here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="th-actions">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className={expanded === order.id ? 'row-expanded' : ''}>
                      <td><strong>{order.id}</strong></td>
                      <td>
                        <div className="admin-table-name">
                          <strong>{order.customer?.name || '—'}</strong>
                          <small>{order.customer?.email || ''}</small>
                        </div>
                      </td>
                      <td className="td-date">{formatDate(order.date)}</td>
                      <td>{order.products?.length || 0}</td>
                      <td className="td-price">{order.total}</td>
                      <td>
                        <span className={`admin-status-chip ${String(order.status || 'Pending').toLowerCase()}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="td-actions">
                        <div className="admin-actions-cell">
                          <button
                            className="admin-mini-btn"
                            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                          >
                            {expanded === order.id ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded === order.id && (
                      <tr className="admin-order-detail-row">
                        <td colSpan="7">
                          <div className="admin-order-detail">
                            <div className="admin-order-detail-col">
                              <h4>Items</h4>
                              {(order.products || []).map((item, i) => (
                                <div className="admin-detail-item" key={i}>
                                  {item.image && <img src={item.image} alt={item.name} />}
                                  <span>{item.name} × {item.quantity}</span>
                                  <em>{item.price}</em>
                                </div>
                              ))}
                            </div>
                            <div className="admin-order-detail-col">
                              <h4>Shipping</h4>
                              <p>{order.customer?.name}</p>
                              <p>{order.customer?.phone}</p>
                              <p>{order.customer?.address}, {order.customer?.city}</p>
                              <h4>Payment</h4>
                              <p>{order.paymentMethod || 'Cash on Delivery'}</p>
                              {order.notes && <><h4>Notes</h4><p>{order.notes}</p></>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="admin-hint">
        📖 Orders are <strong>view only</strong> — they are read from localStorage key <code>orders</code>.
      </p>
    </div>
  );
};

export default AdminOrders;
