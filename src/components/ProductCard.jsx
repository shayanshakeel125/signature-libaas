import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ id, name, price, image, badge }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, name, price, image, badge });
  };

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        <div className="card-image">
          <img src={image} alt={name} />
          {badge && <span className="card-badge">{badge}</span>}
          <button 
            className={`wishlist-heart ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="card-body">
          <h4>{name}</h4>
          <p className="card-price">{price}</p>
          <button className="btn-add-cart" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;