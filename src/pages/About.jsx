import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page-main">

      {/* ====== HERO SECTION ====== */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <span className="about-tag">EST. 2020 — LAHORE, PAKISTAN</span>
            <h1>Crafting <span>Timeless</span> Elegance</h1>
            <p>
              We believe fashion is more than just clothing — it's a story of 
              tradition, craftsmanship, and modern identity woven into every thread.
            </p>
          </div>
        </div>
      </section>

      {/* ====== BRAND STORY ====== */}
      <section className="about-story">
        <div className="story-grid">
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" 
              alt="Our Story" 
            />
            <div className="story-image-accent"></div>
          </div>
          <div className="story-content">
            <span className="section-tag">Our Story</span>
            <h2>From A Small Studio To <span>A Beloved Brand</span></h2>
            <p>
              Signature Libaas was born from a simple dream — to create clothing 
              that celebrates the rich heritage of Pakistani craftsmanship while 
              embracing contemporary global fashion.
            </p>
            <p>
              What started as a small studio in Lahore with just three tailors 
              has now grown into a beloved brand serving thousands of customers 
              across the nation. Every piece we create is a labor of love, 
              carefully designed and meticulously crafted.
            </p>
            <p>
              We source the finest fabrics, work with master artisans, and 
              infuse each design with a signature touch that speaks of 
              elegance, quality, and authenticity.
            </p>
            <Link to="/tshirts" className="btn-story">Explore Collection →</Link>
          </div>
        </div>
      </section>

      {/* ====== STATS COUNTER ====== */}
      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">200+</div>
            <div className="stat-label">Unique Designs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15+</div>
            <div className="stat-label">Cities Delivered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5★</div>
            <div className="stat-label">Customer Rating</div>
          </div>
        </div>
      </section>

      {/* ====== MISSION & VISION ====== */}
      <section className="mission-vision">
        <div className="section-header">
          <span className="section-tag">What Drives Us</span>
          <h2>Our <span>Mission & Vision</span></h2>
        </div>

        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To make premium quality fashion accessible to every Pakistani 
              household by blending traditional craftsmanship with modern 
              aesthetics, at prices that offer true value.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become Pakistan's most trusted and loved fashion brand, 
              recognized internationally for our commitment to quality, 
              sustainability, and timeless design.
            </p>
          </div>
        </div>
      </section>

      {/* ====== OUR VALUES ====== */}
      <section className="our-values">
        <div className="section-header">
          <span className="section-tag">The Signature Way</span>
          <h2>Our Core <span>Values</span></h2>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-number">01</div>
            <div className="value-icon">✨</div>
            <h4>Uncompromising Quality</h4>
            <p>
              We never compromise on fabric, stitching, or finishing. 
              Every product passes through rigorous quality checks.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">02</div>
            <div className="value-icon">🤝</div>
            <h4>Customer First</h4>
            <p>
              Your satisfaction is our priority. From easy returns to 
              responsive support, we're always here for you.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">03</div>
            <div className="value-icon">🌱</div>
            <h4>Sustainable Fashion</h4>
            <p>
              We care about our planet. Our practices focus on ethical 
              sourcing and minimal environmental impact.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">04</div>
            <div className="value-icon">💎</div>
            <h4>Timeless Design</h4>
            <p>
              We create pieces that transcend trends — designs that stay 
              elegant season after season, year after year.
            </p>
          </div>
        </div>
      </section>

      {/* ====== TEAM SECTION ====== */}
      <section className="about-team">
        <div className="section-header">
          <span className="section-tag">The People Behind</span>
          <h2>Meet Our <span>Team</span></h2>
          <p>The passionate minds shaping Signature Libaas</p>
        </div>

        <div className="team-grid">
          <div className="team-card">
            <div className="team-image">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" 
                alt="Founder" 
              />
            </div>
            <h4>Ahmad Khan</h4>
            <p className="team-role">Founder & CEO</p>
            <p className="team-bio">Visionary leader with 10+ years in fashion industry</p>
          </div>

          <div className="team-card">
            <div className="team-image">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" 
                alt="Creative Director" 
              />
            </div>
            <h4>Fatima Ali</h4>
            <p className="team-role">Creative Director</p>
            <p className="team-bio">Award-winning designer with a passion for tradition</p>
          </div>

          <div className="team-card">
            <div className="team-image">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" 
                alt="Head of Operations" 
              />
            </div>
            <h4>Hassan Raza</h4>
            <p className="team-role">Head of Operations</p>
            <p className="team-bio">Ensures every order reaches you perfectly</p>
          </div>

          <div className="team-card">
            <div className="team-image">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" 
                alt="Customer Success" 
              />
            </div>
            <h4>Ayesha Malik</h4>
            <p className="team-role">Customer Success Lead</p>
            <p className="team-bio">Your voice, our priority — always here to help</p>
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="about-cta">
        <div className="cta-content">
          <span className="cta-tag">Join Our Journey</span>
          <h2>Be Part Of The <span>Signature Story</span></h2>
          <p>
            Discover our latest collections and experience the elegance 
            that thousands have fallen in love with.
          </p>
          <div className="cta-buttons">
            <Link to="/tshirts" className="btn-cta-primary">Shop Now →</Link>
            <Link to="/contact" className="btn-cta-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;