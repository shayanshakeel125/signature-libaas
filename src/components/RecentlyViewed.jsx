import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const RecentlyViewed = ({ currentProductId }) => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = stored
      .filter(p => p.id !== currentProductId)
      .slice(0, 4);
    setRecent(filtered);
  }, [currentProductId]);

  if (recent.length === 0) return null;

  return (
    <section className="recently-viewed-section">
      <div className="section-header">
        <span className="section-tag">Recently Viewed</span>
        <h2>You Might Also <span>Like</span></h2>
      </div>

      <div className="product-grid">
        {recent.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            badge={product.badge}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;