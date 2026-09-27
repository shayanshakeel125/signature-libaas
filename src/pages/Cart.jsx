import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'WELCOME20') {
      setDiscount(20);
      setCouponMessage('✅ 20% discount applied!');
    } else if (code === 'SAVE10') {
      setDiscount(10);
      setCouponMessage('✅ 10% discount applied!');
    } else {
      setDiscount(0);
      setCouponMessage('❌ Invalid coupon code');
    }
  };

  const discountAmount = Math.round((cartTotal * discount) / 100);
  const finalTotal = cartTotal - discountAmount;

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="big-icon">🛒</div>
          <h3>Your Cart is Empty</h3>
          <p>Add some products to get started!</p>
          <Link to="/tshirts" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>🛒 Your <span>Cart</span></h1>
        <p>{cartItems.length} item(s) in your cart</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-price">{item.price}</p>
              </div>
              <div className="cart-qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          {/* COUPON CODE */}
          <div className="coupon-section">
            <div className="coupon-input-group">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
            {couponMessage && <p className="coupon-message">{couponMessage}</p>}
            <p className="coupon-hint">Try: WELCOME20 for 20% off</p>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row discount-row">
              <span>Discount ({discount}%)</span>
              <span>- Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>Rs. {finalTotal.toLocaleString()}</span>
          </div>
          
          <button className="btn btn-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;