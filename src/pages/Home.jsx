import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import InstagramFeed from '../components/instagaramFeed';
import { tShirts, kurtis } from '../data/products';

const slides = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    tag: 'NEW ARRIVALS 2026',
    title: 'Summer Collection',
    subtitle: 'Discover timeless elegance crafted for the modern wardrobe',
    cta: 'Shop Collection',
    link: '/tshirts',
    accent: 'Summer'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    tag: 'FESTIVE EDIT',
    title: 'Eid Specials',
    subtitle: 'Exclusive designs for your most memorable celebrations',
    cta: 'Explore Now',
    link: '/kurtis',
    accent: 'Eid'
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
    tag: 'PREMIUM QUALITY',
    title: 'Pret Wear Launches',
    subtitle: 'Where tradition meets modern aesthetics in every stitch',
    cta: 'Discover More',
    link: '/tshirts',
    accent: 'Pret Wear'
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play with progress bar
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Reset progress on manual slide change
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  const featuredProducts = [tShirts[0], kurtis[0], tShirts[3], kurtis[2]];

  return (
    <div className="page-container">

      {/* ====== PREMIUM HERO SLIDER ====== */}
      <div 
        className="hero-slider-premium"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="slider-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.id} className="slide-premium">
              
              {/* Background Image with Ken Burns */}
              <div className="slide-bg-wrapper">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className={`slide-bg-img ${idx === currentSlide ? 'ken-burns-active' : ''}`}
                />
                <div className="slide-gradient-overlay"></div>
                <div className="slide-dark-overlay"></div>
              </div>

              {/* Content */}
              <div className="slide-content-premium">
                {idx === currentSlide && (
                  <>
                    <div className="slide-tag-premium">
                      <span className="tag-line"></span>
                      <span className="tag-text">{slide.tag}</span>
                    </div>

                    <h1 className="slide-title-premium">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className="title-word" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                          {word}&nbsp;
                        </span>
                      ))}
                      <span className="title-accent" style={{ animationDelay: `${0.3 + slide.title.split(' ').length * 0.15}s` }}>
                        {slide.accent}
                      </span>
                    </h1>

                    <p className="slide-subtitle-premium">{slide.subtitle}</p>

                    <div className="slide-actions-premium">
                      <Link to={slide.link} className="btn-primary-slide">
                        <span>{slide.cta}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                      <Link to="/about" className="btn-secondary-slide">
                        Learn More
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Left/Right Buttons */}
        <button className="nav-arrow-premium prev" onClick={prevSlide} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="nav-arrow-premium next" onClick={nextSlide} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="slider-progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Thumbnails/Dots */}
        <div className="slider-thumbs-premium">
          {slides.map((slide, idx) => (
            <button 
              key={idx}
              className={`thumb-item ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
            >
              <img src={slide.image} alt={`Slide ${idx + 1}`} />
              <div className="thumb-overlay">
                <span className="thumb-number">0{idx + 1}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="slider-counter">
          <span className="current-num">0{currentSlide + 1}</span>
          <span className="counter-divider">/</span>
          <span className="total-num">0{slides.length}</span>
        </div>
      </div>

      {/* ====== TRUST BANNER ====== */}
      <div className="features-banner">
        <div className="feature-box">
          <span className="feature-icon">🚚</span>
          <div><strong>Free Shipping</strong><p>On orders over Rs. 3000</p></div>
        </div>
        <div className="feature-box">
          <span className="feature-icon">🔄</span>
          <div><strong>Easy Returns</strong><p>7-day return policy</p></div>
        </div>
        <div className="feature-box">
          <span className="feature-icon">🔒</span>
          <div><strong>Secure Payment</strong><p>100% safe checkout</p></div>
        </div>
        <div className="feature-box">
          <span className="feature-icon">✨</span>
          <div><strong>Premium Quality</strong><p>100% original products</p></div>
        </div>
      </div>

      {/* ====== CATEGORY SHOWCASE ====== */}
      <section className="category-showcase">
        <div className="category-card category-tshirts">
          <div className="cat-overlay">
            <span>Collection</span>
            <h3>Premium T-Shirts</h3>
            <Link to="/tshirts" className="cat-btn">Shop Now →</Link>
          </div>
        </div>
        <div className="category-card category-kurtis">
          <div className="cat-overlay">
            <span>Collection</span>
            <h3>Elegant Kurtis</h3>
            <Link to="/kurtis" className="cat-btn">Shop Now →</Link>
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section className="product-section">
        <div className="section-header">
          <span className="section-tag">Best Sellers</span>
          <h2>Trending <span>This Week</span></h2>
          <p>Handpicked pieces loved by our customers</p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              badge={product.badge}
            />
          ))}
        </div>
      </section>

      {/* ====== PROMO BANNER ====== */}
      <section className="promo-banner">
        <div className="promo-content">
          <span className="promo-tag">Limited Time Offer</span>
          <h2>Get <span>20% OFF</span> on Your First Order</h2>
          <p>Use code <strong>WELCOME20</strong> at checkout</p>
          <Link to="/tshirts" className="btn-slide">Start Shopping →</Link>
        </div>
      </section>

      <Testimonials />
      <InstagramFeed />
    </div>
  );
};

export default Home;
















