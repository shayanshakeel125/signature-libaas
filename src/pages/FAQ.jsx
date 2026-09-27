import React, { useState } from 'react';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3-5 working days across Pakistan. Lahore, Karachi, and Islamabad usually receive orders within 2-3 days.'
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 7-day easy return policy. If you are not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange.'
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes! We offer Cash on Delivery (COD) across Pakistan. You pay only when you receive your order.'
  },
  {
    q: 'How do I choose the right size?',
    a: 'Each product page has a detailed size chart. We recommend measuring yourself and comparing with our size guide. If you are between sizes, we suggest sizing up.'
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently, we only ship within Pakistan. International shipping will be available soon. Follow us on Instagram for updates.'
  },
  {
    q: 'Can I cancel or change my order?',
    a: 'Yes, you can cancel or modify your order within 2 hours of placing it. Contact us via WhatsApp or email for assistance.'
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use it to track your package.'
  },
  {
    q: 'Are the colors exactly as shown in pictures?',
    a: 'We try our best to show accurate colors. However, slight variations may occur due to screen settings and lighting conditions.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>❓ Frequently Asked <span>Questions</span></h1>
        <p>Everything you need to know about our products and services</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggle(idx)}>
              <span>{faq.q}</span>
              <span className="faq-icon">{openIndex === idx ? '−' : '+'}</span>
            </button>
            <div className="faq-answer">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <h3>Still have questions?</h3>
        <p>Can't find the answer you're looking for? Our team is here to help.</p>
        <a href="/contact" className="btn-faq">Contact Us →</a>
      </div>
    </div>
  );
};

export default FAQ;
