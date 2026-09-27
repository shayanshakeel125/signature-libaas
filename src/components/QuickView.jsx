import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const QuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  // Reset when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedSize(product.sizes?.[0] || '');
    }
  }, [product]);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
    onClose();
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="quickview-close" onClick={onClose}>✕</button>

        <div className="quickview-grid">
          
          {/* LEFT: Image */}
          <div className="quickview-image">
            <img src={product.images[0]} alt={product.name} />
            {product.badge && <span className="quickview-badge">{product.badge}</span>}
          </div>

          {/* RIGHT: Info */}
          <div className="quickview-info">
            <span className="quickview-cat">{product.category}</span>
            <h2>{product.name}</h2>
            <p className="quickview-price">{product.price}</p>
            
            <p className="quickview-desc">{product.description}</p>

            {/* Size Selector */}
            {product.sizes && (
              <div className="quickview-sizes">
                <h4>Size:</h4>
                <div className="quickview-size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`quickview-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="quickview-qty">
              <h4>Quantity:</h4>
              <div className="quickview-qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="quickview-actions">
              <button className="quickview-add-cart" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <Link 
                to={`/product/${product.id}`} 
                className="quickview-view-details"
                onClick={onClose}
              >
                View Full Details →
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickView;