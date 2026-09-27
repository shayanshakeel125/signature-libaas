import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Khan',
    location: 'Lahore',
    rating: 5,
    text: 'Bohat umda quality hai! Stitching perfect hai aur delivery bhi jaldi hui. Highly recommended!',
    image: 'https://i.pravatar.cc/100?img=1'
  },
  {
    id: 2,
    name: 'Fatima Ahmed',
    location: 'Karachi',
    rating: 5,
    text: 'Main ne 3 kurtis order ki hain, sab bohat khoobsurat hain. Fabric bohat acha hai. Thank you!',
    image: 'https://i.pravatar.cc/100?img=5'
  },
  {
    id: 3,
    name: 'Hassan Ali',
    location: 'Islamabad',
    rating: 5,
    text: 'T-Shirts ki quality market se bohat behtar hai. Price bhi reasonable hai. Zaroor dobara khareedunga.',
    image: 'https://i.pravatar.cc/100?img=12'
  },
  {
    id: 4,
    name: 'Maryam Tariq',
    location: 'Rawalpindi',
    rating: 5,
    text: 'Customer service bohat achi hai. Order tracking easy tha. Product exactly waisa hi aaya jaisa picture mein tha.',
    image: 'https://i.pravatar.cc/100?img=9'
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <span className="section-tag">Customer Love</span>
        <h2>What Our <span>Customers Say</span></h2>
        <p>Trusted by thousands of happy customers across Pakistan</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map(t => (
          <div key={t.id} className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <div className="testimonial-stars">
              {'★'.repeat(t.rating)}
            </div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-author">
              <img src={t.image} alt={t.name} />
              <div>
                <h4>{t.name}</h4>
                <span>{t.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;