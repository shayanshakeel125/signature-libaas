import React from 'react';

const Home = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>
          Welcome to <span>Signature Libaas</span>
        </h1>
        <p>Your premium destination for Pakistani pret wear ✨</p>
        <button className="btn">Explore Collection</button>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature-item">
          <div className="icon">👗</div>
          <h4>Premium Quality</h4>
          <p>100% pure fabrics</p>
        </div>
        <div className="feature-item">
          <div className="icon">🚀</div>
          <h4>Fast Delivery</h4>
          <p>Pan Pakistan shipping</p>
        </div>
        <div className="feature-item">
          <div className="icon">💰</div>
          <h4>Best Prices</h4>
          <p>Affordable luxury</p>
        </div>
        <div className="feature-item">
          <div className="icon">🔄</div>
          <h4>Easy Returns</h4>
          <p>Hassle-free policy</p>
        </div>
      </div>
    </div>
  );
};

export default Home;