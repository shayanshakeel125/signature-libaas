import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-main">
      {/* ====== NEWSLETTER SECTION ====== */}
      <div className="footer-newsletter">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>Join Our Newsletter</h3>
            <p>Subscribe to get special offers, free giveaways, and exclusive deals.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              {subscribed ? '✓ Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* ====== MAIN FOOTER ====== */}
      <div className="footer-main-content">
        <div className="footer-grid">

          {/* Column 1: Brand Info */}
          <div className="footer-col footer-brand">
            <h4 className="footer-logo">Signature <span>Libaas</span></h4>
            <p className="footer-about">
              Premium Pakistani pret wear brand crafting elegant designs 
              for the modern wardrobe. Where tradition meets contemporary fashion.
            </p>
            
            {/* Social Icons */}
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/tshirts">T-Shirts</Link></li>
              <li><Link to="/kurtis">Kurtis</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
<div className="footer-col">
  <h4>Customer Service</h4>
  <ul className="footer-links">
    <li><a href="#">Shipping Policy</a></li>
    <li><a href="#">Return & Exchange</a></li>
    <li><a href="#">Size Guide</a></li>
    <li><a href="#">Track Your Order</a></li>
    <li><Link to="/faq">FAQs</Link></li>
    <li><Link to="/terms">Terms & Conditions</Link></li>
    <li><Link to="/privacy">Privacy Policy</Link></li>
  </ul>
</div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📍</span>
                <span>123 Fashion Street, Gulberg III, Lahore, Pakistan</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+923001234567">+92 300 1234567</a>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <a href="mailto:info@signaturelibaas.com">info@signaturelibaas.com</a>
              </li>
              <li>
                <span className="contact-icon">🕒</span>
                <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ====== MAP SECTION ====== */}
        <div className="footer-map">
          <h4>Visit Our Store</h4>
          <div className="map-container">
            <iframe
              title="Signature Libaas Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108882.51667657613!2d74.24161745!3d31.4832183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sGulberg%20III%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* ====== PAYMENT METHODS ====== */}
        <div className="footer-payments">
          <span className="payment-label">We Accept:</span>
          <div className="payment-icons">
            <div className="payment-badge">VISA</div>
            <div className="payment-badge">Mastercard</div>
            <div className="payment-badge">Easypaisa</div>
            <div className="payment-badge">JazzCash</div>
            <div className="payment-badge">COD</div>
          </div>
        </div>

      </div>

      {/* ====== BOTTOM BAR ====== */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 <strong>Signature Libaas</strong>. All Rights Reserved.</p>
          <p>Designed with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;