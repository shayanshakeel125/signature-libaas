import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="page-container">
        <div className="category-header">
          <h1>❤️ My <span>Wishlist</span></h1>
          <p>Your favorite products, saved for later</p>
        </div>
        <div className="empty-state">
          <div className="big-icon">💔</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Start adding products you love!</p>
          <Link to="/tshirts" className="btn" style={{ marginTop: '20px', display: 'inline-block' }}>
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>❤️ My <span>Wishlist</span></h1>
        <p>{wishlistCount} item(s) saved</p>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item-wrapper">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={product.badge}
            />
            <div className="wishlist-actions">
              <button 
                className="wishlist-add-cart"
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                })}
              >
                🛒 Add to Cart
              </button>
              <button 
                className="wishlist-remove"
                onClick={() => removeFromWishlist(product.id)}
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;