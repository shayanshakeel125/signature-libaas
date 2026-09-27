import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { cartCount, addToCart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
  });

  // Orders load from localStorage
  const [orders] = useState(() => {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  });

  // Reorder function
  const handleReorder = (order) => {
    order.products.forEach(product => {
      for (let i = 0; i < product.quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        });
      }
    });
    navigate('/cart');
  };

  // Agar user logged in nahi hai toh login page par bhejein
  if (!user) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="big-icon">🔒</div>
          <h3>Please Login First</h3>
          <p>You need to be logged in to view this page.</p>
          <Link to="/login" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setSaveMessage('');
  };

  const handleSave = () => {
    setSaveMessage('✅ Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="page-container">
      <div className="profile-layout">

        {/* LEFT: SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Edit Profile
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              📍 Addresses
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 My Orders
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              ❤️ Wishlist
            </button>
            <button
              className="profile-nav-item logout-nav"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* RIGHT: CONTENT */}
        <main className="profile-content">

          {/* TAB: Overview */}
          {activeTab === 'overview' && (
            <div className="profile-tab">
              <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p className="profile-subtitle">Here's a quick look at your account</p>

              <div className="stats-grid-profile">
                <div className="stat-card-profile">
                  <div className="stat-icon">📦</div>
                  <div className="stat-number">{orders.length}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card-profile">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-number">{cartCount}</div>
                  <div className="stat-label">Items in Cart</div>
                </div>
                <div className="stat-card-profile">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-number">{wishlistCount}</div>
                  <div className="stat-label">Wishlist Items</div>
                </div>
                <div className="stat-card-profile">
                  <div className="stat-icon">💰</div>
                  <div className="stat-number">Rs. 0</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-row">
                    <span>Full Name:</span>
                    <strong>{user.name}</strong>
                  </div>
                  <div className="info-row">
                    <span>Email:</span>
                    <strong>{user.email}</strong>
                  </div>
                  <div className="info-row">
                    <span>Phone:</span>
                    <strong>Not set</strong>
                  </div>
                  <div className="info-row">
                    <span>Member Since:</span>
                    <strong>2026</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Edit Profile */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h1>👤 Edit Profile</h1>
              <p className="profile-subtitle">Update your personal information</p>

              {saveMessage && <div className="save-message">{saveMessage}</div>}

              <div className="edit-form">
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="auth-input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="auth-input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+92 300 1234567"
                    value={editForm.phone}
                    onChange={handleEditChange}
                  />
                </div>
                <button className="btn-auth" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB: Addresses */}
          {activeTab === 'address' && (
            <div className="profile-tab">
              <h1>📍 My Addresses</h1>
              <p className="profile-subtitle">Manage your shipping addresses</p>

              <div className="empty-state-small">
                <div className="big-icon">🏠</div>
                <h3>No Addresses Saved</h3>
                <p>Add your first address for faster checkout</p>
                <button className="btn" style={{ marginTop: '20px' }}>
                  + Add New Address
                </button>
              </div>
            </div>
          )}

          {/* TAB: Orders */}
          {activeTab === 'orders' && (
            <div className="profile-tab">
              <h1>📦 My Orders</h1>
              <p className="profile-subtitle">Track your order history</p>

              {orders.length === 0 ? (
                <div className="empty-state-small">
                  <div className="big-icon">📭</div>
                  <h3>No Orders Yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <Link to="/tshirts" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">

                      {/* Order Header */}
                      <div className="order-card-header">
                        <div>
                          <span className="order-id-label">Order ID:</span>
                          <strong className="order-id">{order.id}</strong>
                        </div>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status === 'Pending' && '⏳ Pending'}
                          {order.status === 'Packed' && '📦 Packed'}
                          {order.status === 'Shipped' && '🚚 Shipped'}
                          {order.status === 'Delivered' && '✅ Delivered'}
                          {order.status === 'Cancelled' && '❌ Cancelled'}
                        </span>
                      </div>

                      {/* Order Meta */}
                      <div className="order-card-meta">
                        <span>📅 {new Date(order.date).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                        <span>💰 {order.total}</span>
                      </div>

                      {/* Products */}
                      <div className="order-products">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="order-product-item">
                            <img src={product.image} alt={product.name} />
                            <div className="order-product-info">
                              <h4>{product.name}</h4>
                              <p>Qty: {product.quantity}</p>
                            </div>
                            <span className="order-product-price">{product.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="order-actions">
                        <button
                          className="btn-order-reorder"
                          onClick={() => handleReorder(order)}
                        >
                          🔄 Reorder
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="profile-tab">
              <h1>❤️ My Wishlist</h1>
              <p className="profile-subtitle">Your favorite items</p>

              <div className="empty-state-small">
                <div className="big-icon">💔</div>
                <h3>Wishlist is Empty</h3>
                <p>Add products you love to your wishlist</p>
                <Link to="/wishlist" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>
                  View Wishlist Page
                </Link>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;
