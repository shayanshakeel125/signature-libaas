import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const form = useRef();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="big-icon">🛒</div>
          <h3>Cart is Empty</h3>
          <p>Add products before checkout</p>
        </div>
      </div>
    );
  }

  const orderDetails = cartItems
    .map(item => `${item.name} x ${item.quantity} = ${item.price}`)
    .join('\n');

  const generateOrderId = () => {
    return 'ORD-' + Date.now().toString().slice(-8);
  };

  const saveOrder = (formData) => {
    const newOrder = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: 'Pending',
      customer: {
        name: formData.get('customer_name'),
        email: formData.get('customer_email'),
        phone: formData.get('customer_phone'),
        address: formData.get('customer_address'),
        city: formData.get('customer_city')
      },
      paymentMethod: formData.get('payment_method'),
      notes: formData.get('order_notes'),
      products: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      total: `Rs. ${cartTotal.toLocaleString()}`,
      totalNumber: cartTotal
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    console.log('✅ Order saved! Total orders:', updatedOrders.length);

    return newOrder.id;
  };

  const sendOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    const formData = new FormData(form.current);
    const orderId = saveOrder(formData);

    // Email bhejne ke liye data append
    formData.append('order_details', orderDetails);
    formData.append('order_total', `Rs. ${cartTotal.toLocaleString()}`);
    formData.append('order_id', orderId);

    emailjs
      .sendForm(
        'service_ilru9yj',        // ✅ Nayi Service ID
        'template_qpi2xoa',       // ✅ Template ID
        form.current,
        'K0oHu6utj5UlA_Vna'       // ✅ Public Key
      )
      .then(() => {
        console.log('✅ Email sent successfully!');
        setStatusMessage({ 
          type: 'success', 
          text: `✅ Order placed! Order ID: ${orderId}` 
        });
        clearCart();
        setTimeout(() => navigate(`/order-success/${orderId}`), 1500);
      })
      .catch((error) => {
        console.error('❌ Email error:', error);
        setStatusMessage({ 
          type: 'success', 
          text: `✅ Order placed! Order ID: ${orderId}` 
        });
        clearCart();
        setTimeout(() => navigate(`/order-success/${orderId}`), 1500);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>💳 <span>Checkout</span></h1>
        <p>Fill in your details to complete the order</p>
      </div>

      <div className="checkout-layout">
        <form ref={form} onSubmit={sendOrder} className="checkout-form">
          <h3>Shipping Details</h3>
          <input 
            type="text" 
            name="customer_name" 
            placeholder="Full Name" 
            defaultValue={user?.name || ''}
            required 
          />
          <input 
            type="email" 
            name="customer_email" 
            placeholder="Email" 
            defaultValue={user?.email || ''}
            required 
          />
          <input type="tel" name="customer_phone" placeholder="Phone Number" required />
          <input type="text" name="customer_address" placeholder="Full Address" required />
          <input type="text" name="customer_city" placeholder="City" required />

          <h3 style={{ marginTop: '20px' }}>Payment Method</h3>
          <select name="payment_method" required>
            <option value="">Select Payment Method</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Easypaisa/JazzCash">Easypaisa / JazzCash</option>
          </select>

          <textarea name="order_notes" rows="3" placeholder="Order Notes (Optional)"></textarea>

          {statusMessage && (
            <div className={`status-message ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          <button type="submit" className="btn btn-full" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : `Place Order — Rs. ${cartTotal.toLocaleString()}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Your Order</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>{item.price}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;