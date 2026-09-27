
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    emailjs
      .sendForm(
        'service_ilru9yj',        // ✅ Service ID
        'template_2tmtipe',       // ✅ Contact Template ID
        form.current,
        'K0oHu6utj5UlA_Vna'       // ✅ Public Key
      )
      .then(() => {
        setStatusMessage({ 
          type: 'success', 
          text: '✅ Message sent! We will get back to you soon.' 
        });
        form.current.reset();
        setIsSubmitting(false);
      })
      .catch((error) => {
        setStatusMessage({ 
          type: 'error', 
          text: '❌ Failed to send. Please try again.' 
        });
        console.error('Email error:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>📞 <span>Contact</span> Us</h1>
        <p>We're here to help and answer any questions</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <h3>Get in Touch</h3>
          <div className="info-item">
            <span className="icon">📍</span>
            <div><strong>Address</strong><p>Lahore, Pakistan</p></div>
          </div>
          <div className="info-item">
            <span className="icon">📧</span>
            <div><strong>Email</strong><p>info@signaturelibaas.com</p></div>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <div><strong>Phone</strong><p>+92 300 1234567</p></div>
          </div>
          <div className="info-item">
            <span className="icon">🕒</span>
            <div><strong>Working Hours</strong><p>Mon - Fri: 10am - 7pm</p></div>
          </div>
        </div>

        <div className="contact-form-card">
          <h3>Send Us a Message</h3>
          <form ref={form} onSubmit={sendEmail}>
            <input type="text" name="from_name" placeholder="Your Name" required />
            <input type="email" name="from_email" placeholder="Your Email" required />
            <input type="text" name="subject" placeholder="Subject" />
            <textarea name="message" rows="4" placeholder="Your Message" required></textarea>

            {statusMessage && (
              <div className={`status-message ${statusMessage.type}`}>
                {statusMessage.text}
              </div>
            )}

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;