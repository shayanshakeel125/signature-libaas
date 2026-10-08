import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== OUTSIDE CLICK → dropdown close (Requirement 1-5) =====
  const userMenuRef = useRef(null);      // .user-menu-wrapper (button + dropdown)
  const categoriesRef = useRef(null);    // .dropdown (trigger + menu)

  useEffect(() => {
    // Listener sirf tab lagao jab koi dropdown khula ho (performance + no-op clicks)
    if (!isUserMenuOpen && !isDropdownOpen) return;

    const handleOutsideClick = (e) => {
      // User menu: sirf tab close jab click wrapper ke BAHAR ho
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      // Categories: sirf tab close jab click dropdown ke BAHAR ho
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isUserMenuOpen, isDropdownOpen]);
z
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">

          {/* LOGO */}
          <Link to="/" className="logo" onClick={handleLinkClick}>
            <div className="logo-crop">
              <img
                src={
                  settings.logo ||
                  `${import.meta.env.BASE_URL}images/${theme === 'dark' ? 'logo-dark.png' : 'logo-light.png'}`
                }
                alt={settings.brandName}
                title={settings.brandName}
                className="logo-img"
              />
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={handleLinkClick}>
              <span>Home</span>
            </NavLink>

            <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}
              ref={categoriesRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="dropdown-trigger" onClick={toggleDropdown}>
                <span>Categories</span>
                <svg className="dropdown-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                <NavLink to="/tshirts" onClick={handleLinkClick}>
                  <span className="dropdown-item-icon">👕</span>
                  <span>T-Shirts</span>
                </NavLink>
                <NavLink to="/kurtis" onClick={handleLinkClick}>
                  <span className="dropdown-item-icon">👗</span>
                  <span>Kurtis</span>
                </NavLink>
              </div>
            </div>

            {/* Admin-configurable links (Site Settings → Navbar Links) */}
            {settings.navLinks
              .filter(l => l.label && l.to && l.to.startsWith('/'))
              .map(link => (
                <NavLink
                  key={`${link.label}-${link.to}`}
                  to={link.to}
                  className={({ isActive }) => isActive ? 'active-link' : ''}
                  onClick={handleLinkClick}
                >
                  <span>{link.label}</span>
                </NavLink>
              ))}
          </div>

          {/* NAV ACTIONS */}
          <div className="nav-actions">

            {/* SEARCH */}
            <button
              className="icon-btn-nav"
              onClick={() => setIsSearchOpen(true)}
              title="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="icon-btn-nav"
              onClick={handleLinkClick}
              title="Wishlist"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wishlistCount > 0 && (
                <span className="icon-badge">{wishlistCount}</span>
              )}
            </Link>

            {/* THEME TOGGLE */}
            <button
              className="icon-btn-nav theme-btn"
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              <div className="theme-icon-wrapper">
                {theme === 'light' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                )}
              </div>
            </button>

            {/* CART */}
            <Link
              to="/cart"
              className="icon-btn-nav cart-btn-nav"
              onClick={handleLinkClick}
              title="Cart"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span className="icon-badge">{cartCount}</span>
              )}
            </Link>

            {/* ADMIN BADGE (sirf tab jab admin logged in ho) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="admin-nav-badge"
                onClick={handleLinkClick}
                title="Admin Dashboard"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Admin</span>
              </Link>
            )}

            {/* USER MENU */}
            {user ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="user-avatar-btn"
                  onClick={toggleUserMenu}
                  title={user.name}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <div className="user-avatar-lg">{user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="user-menu-item" onClick={handleLinkClick}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      My Profile
                    </Link>
                    <Link to="/wishlist" className="user-menu-item" onClick={handleLinkClick}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      My Wishlist
                    </Link>
                    <Link to="/track-order" className="user-menu-item" onClick={handleLinkClick}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                      Track Order
                    </Link>
                    <button className="user-menu-item logout-item" onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="user-avatar-btn" onClick={handleLinkClick} title="Login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            )}

            {/* HAMBURGER */}
            <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;