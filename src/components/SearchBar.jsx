import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../data/products';

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Auto focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

  // Search logic
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
    setResults(filtered.slice(0, 6)); // Max 6 results
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Search Input */}
        <div className="search-header">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>✕</button>
        </div>

        {/* Results */}
        <div className="search-results">
          {query === '' && (
            <div className="search-empty">
              <p>Popular searches:</p>
              <div className="search-tags">
                {['Kurti', 'T-Shirt', 'Cotton', 'Embroidered', 'Polo'].map(tag => (
                  <button key={tag} onClick={() => setQuery(tag)} className="search-tag">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query !== '' && results.length === 0 && (
            <div className="search-no-result">
              <div className="no-result-icon">🔍</div>
              <p>No results found for "<strong>{query}</strong>"</p>
              <span>Try different keywords</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="search-items">
              <p className="search-count">{results.length} result(s) found</p>
              {results.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="search-item"
                  onClick={onClose}
                >
                  <img src={product.images[0]} alt={product.name} />
                  <div className="search-item-info">
                    <h4>{product.name}</h4>
                    <span className="search-item-cat">{product.category}</span>
                    <span className="search-item-price">{product.price}</span>
                  </div>
                  <span className="search-arrow">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchBar;