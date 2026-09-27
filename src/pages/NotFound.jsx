import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        
        <div className="notfound-code">
          <span>4</span>
          <span className="notfound-circle">0</span>
          <span>4</span>
        </div>

        <h1>Oops! Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>

        <div className="notfound-actions">
          <Link to="/" className="btn-notfound-primary">
            🏠 Go Back Home
          </Link>
          <Link to="/tshirts" className="btn-notfound-secondary">
            🛍️ Shop Collection
          </Link>
        </div>

        <div className="notfound-suggestions">
          <p>You might be looking for:</p>
          <div className="notfound-links">
            <Link to="/tshirts">T-Shirts</Link>
            <Link to="/kurtis">Kurtis</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;