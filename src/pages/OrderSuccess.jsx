import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = allOrders.find(o => o.id === id);
    setOrder(found);
  }, [id]);

  // Auto redirect countdown
  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="success-modal-overlay">
      
      {/* Confetti Bubbles */}
      <div className="confetti-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 5}`}></div>
        ))}
      </div>

      {/* Main Modal */}
      <div className="success-modal">
        
        {/* Close Button */}
        <button className="success-close-btn" onClick={handleClose} title="Close">
          ✕
        </button>

        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <div className="success-icon-outer">
            <div className="success-icon-inner">
              <svg viewBox="0 0 24 24" className="success-svg">
                <path 
                  d="M5 13l4 4L19 7" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Header */}
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for shopping with <strong>Signature Libaas</strong>.
          Your order has been confirmed.
        </p>

        {/* Order ID Box */}
        <div className="success-order-box">
          <div className="success-order-box-header">
            <span className="success-order-label">Order ID</span>
            <span className="success-status-badge">⏳ Pending</span>
          </div>
          <div className="success-order-id-row">
            <span className="success-order-id">{id}</span>
            <button 
              className={`success-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Order Details Grid */}
        {order && (
          <div className="success-details-grid">
            <div className="success-detail-item">
              <span className="success-detail-icon">📅</span>
              <div>
                <span className="success-detail-label">Order Date</span>
                <strong className="success-detail-value">
                  {new Date(order.date).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </strong>
              </div>
            </div>
            <div className="success-detail-item">
              <span className="success-detail-icon">💰</span>
              <div>
                <span className="success-detail-label">Total Amount</span>
                <strong className="success-detail-value success-accent">
                  {order.total}
                </strong>
              </div>
            </div>
            <div className="success-detail-item">
              <span className="success-detail-icon">💳</span>
              <div>
                <span className="success-detail-label">Payment</span>
                <strong className="success-detail-value">{order.paymentMethod}</strong>
              </div>
            </div>
            <div className="success-detail-item">
              <span className="success-detail-icon">📦</span>
              <div>
                <span className="success-detail-label">Items</span>
                <strong className="success-detail-value">
                  {order.products.length} product(s)
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="success-info-message">
          <span>📧</span>
          <p>
            Order confirmation has been sent to your email.
            We'll contact you soon for delivery confirmation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="success-modal-actions">
          <Link to="/track-order" className="success-btn-primary">
            <span>📦</span> Track Order
          </Link>
          <Link to="/profile" className="success-btn-secondary">
            <span>👤</span> My Orders
          </Link>
        </div>

        {/* Auto-redirect message */}
        <p className="success-redirect-note">
          Redirecting to home in <strong>{countdown}s</strong>...
        </p>

        {/* Bottom Link */}
        <Link to="/tshirts" className="success-continue-link">
          Continue Shopping →
        </Link>

      </div>
    </div>
  );
};

export default OrderSuccess;