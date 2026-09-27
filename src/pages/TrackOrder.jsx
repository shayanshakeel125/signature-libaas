import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    // localStorage se orders nikalna
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Order ID se match karna (case insensitive)
    const found = allOrders.find(
      o => o.id.toLowerCase() === orderId.trim().toLowerCase()
    );

    if (!found) {
      setError('❌ No order found with this ID. Please check and try again.');
      return;
    }

    setOrder(found);
  };

  // Status ke hisaab se timeline step index
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Packed': return 2;
      case 'Shipped': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>📦 Track Your <span>Order</span></h1>
        <p>Enter your Order ID to check the status</p>
      </div>

      {/* Search Box */}
      <div className="track-search-card">
        <form onSubmit={handleTrack} className="track-search-form">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., ORD-12345678)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit">🔍 Track Order</button>
        </form>
        <p className="track-hint">
          💡 Order ID aap ke order confirmation email/message mein mili hogi
        </p>
      </div>

      {/* Error */}
      {error && <div className="track-error">{error}</div>}

      {/* Order Found - Show Details */}
      {order && (
        <div className="track-result">

          {/* Order Header */}
          <div className="track-header">
            <div>
              <span className="track-label">Order ID</span>
              <h2>{order.id}</h2>
            </div>
            <div className="track-header-right">
              <span className="track-label">Order Date</span>
              <p>
                {new Date(order.date).toLocaleDateString('en-PK', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="track-timeline">
            <h3>Order Status</h3>
            
            {order.status === 'Cancelled' ? (
              <div className="timeline-cancelled">
                <div className="timeline-icon-cancelled">❌</div>
                <div>
                  <h4>Order Cancelled</h4>
                  <p>This order has been cancelled. Contact support for more info.</p>
                </div>
              </div>
            ) : (
              <div className="timeline-steps">
                {[
                  { label: 'Order Placed', icon: '✅', step: 1 },
                  { label: 'Packed', icon: '📦', step: 2 },
                  { label: 'Shipped', icon: '🚚', step: 3 },
                  { label: 'Out for Delivery', icon: '🛵', step: 4 },
                  { label: 'Delivered', icon: '🏠', step: 5 },
                ].map((item, idx) => {
                  const currentStep = getStatusStep(order.status);
                  const isCompleted = item.step <= currentStep;
                  const isActive = item.step === currentStep;
                  const isLast = idx === 4;

                  return (
                    <div
                      key={item.step}
                      className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                      <div className="timeline-node">
                        <div className="timeline-circle">
                          {isCompleted ? item.icon : '○'}
                        </div>
                        {!isLast && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-info">
                        <h4>{item.label}</h4>
                        {isActive && <p className="timeline-current">Current Status</p>}
                        {isCompleted && !isActive && <p className="timeline-done">Completed</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Info Grid */}
          <div className="track-info-grid">
            <div className="track-info-card">
              <h3>📦 Items ({order.products.length})</h3>
              {order.products.map((p, i) => (
                <div key={i} className="track-product">
                  <img src={p.image} alt={p.name} />
                  <div>
                    <h4>{p.name}</h4>
                    <p>Qty: {p.quantity} × {p.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="track-info-card">
              <h3>🚚 Delivery Address</h3>
              <p><strong>{order.customer.name}</strong></p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}</p>
              <p>📞 {order.customer.phone}</p>
              <p>📧 {order.customer.email}</p>
            </div>

            <div className="track-info-card">
              <h3>💳 Payment</h3>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              <p><strong>Total:</strong> {order.total}</p>
              {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="track-actions">
            <Link to="/contact" className="btn-track-contact">
              💬 Contact Support
            </Link>
            <Link to="/tshirts" className="btn-track-shop">
              🛍️ Continue Shopping
            </Link>
          </div>

        </div>
      )}

      {/* Help Section */}
      {!order && !error && (
        <div className="track-help">
          <h3>Need help finding your Order ID?</h3>
          <p>
            Check your <strong>confirmation email</strong> or <strong>SMS</strong>. 
            Agar phir bhi na mile, humein contact karein.
          </p>
          <Link to="/contact" className="btn">📞 Contact Support</Link>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;