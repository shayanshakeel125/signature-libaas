import React from 'react';

const instaPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80', likes: 1243 },
  { id: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', likes: 892 },
  { id: 3, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', likes: 1567 },
  { id: 4, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', likes: 2104 },
  { id: 5, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', likes: 934 },
  { id: 6, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80', likes: 1876 }
];

const InstagramFeed = () => {
  return (
    <section className="instagram-section">
      <div className="section-header">
        <span className="section-tag">Follow Us</span>
        <h2>On <span>Instagram</span></h2>
        <p>@signaturelibaas — Tag us to get featured!</p>
      </div>

      <div className="instagram-grid">
        {instaPosts.map(post => (
          <a 
            key={post.id} 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="instagram-item"
          >
            <img src={post.image} alt="Instagram post" />
            <div className="instagram-overlay">
              <span>❤️ {post.likes.toLocaleString()}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="instagram-cta">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn-instagram">
          Follow @signaturelibaas
        </a>
      </div>
    </section>
  );
};

export default InstagramFeed;