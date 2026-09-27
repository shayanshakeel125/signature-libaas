import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import SizeGuideModal from '../components/SizeGuideModal';
import RecentlyViewed from '../components/RecentlyViewed';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = getProductById(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="big-icon">❌</div>
          <h3>Product Not Found</h3>
          <Link to="/" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
    alert(`✅ ${quantity} × ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
    navigate('/checkout');
  };

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / 
        <Link to={product.category === 'T-Shirts' ? '/tshirts' : '/kurtis'}> {product.category}</Link> / 
        <span> {product.name}</span>
      </div>

      <div className="product-detail-layout">
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            {product.badge && <span className="detail-badge">{product.badge}</span>}
          </div>
          <div className="thumbnail-row">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${idx === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-detail-price">{product.price}</p>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.sizes && (
            <div className="size-selector">
              <div className="size-selector-header">
                <h4>Select Size:</h4>
                <button 
                  className="size-guide-btn"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  📏 Size Guide
                </button>
              </div>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-selector">
            <h4>Quantity:</h4>
            <div className="qty-controls">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-add-cart-detail" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>
          </div>

          <div className="product-extras">
            <div className="extra-item">🚚 Free Delivery over Rs. 3000</div>
            <div className="extra-item">🔄 7-Day Easy Returns</div>
            <div className="extra-item">✅ 100% Original Product</div>
          </div>
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      {/* RECENTLY VIEWED */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
};

export default ProductDetail;