import React, { useState } from 'react';

const FilterSort = ({ 
  sortBy, setSortBy, 
  priceFilter, setPriceFilter,
  sizeFilter, setSizeFilter,
  availableSizes = ['S', 'M', 'L', 'XL'],
  totalProducts,
  filteredCount
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under Rs. 1500', value: 'under-1500' },
    { label: 'Rs. 1500 - 3000', value: '1500-3000' },
    { label: 'Rs. 3000 - 5000', value: '3000-5000' },
    { label: 'Above Rs. 5000', value: 'above-5000' },
  ];

  const sortOptions = [
    { label: 'Featured', value: 'featured', icon: '⭐' },
    { label: 'Price: Low to High', value: 'price-low', icon: '⬆️' },
    { label: 'Price: High to Low', value: 'price-high', icon: '⬇️' },
    { label: 'Name: A to Z', value: 'name-az', icon: '🔤' },
    { label: 'Newest First', value: 'newest', icon: '🆕' },
  ];

  const toggleSize = (size) => {
    if (sizeFilter.includes(size)) {
      setSizeFilter(sizeFilter.filter(s => s !== size));
    } else {
      setSizeFilter([...sizeFilter, size]);
    }
  };

  const activeFiltersCount = 
    (priceFilter !== 'all' ? 1 : 0) + sizeFilter.length + (sortBy !== 'featured' ? 1 : 0);

  const clearAll = () => {
    setSortBy('featured');
    setPriceFilter('all');
    setSizeFilter([]);
  };

  return (
    <>
      {/* ====== MOBILE: TOP BAR WITH FILTER BUTTON ====== */}
      <div className="filter-mobile-bar">
        <div className="results-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalProducts}</strong>
        </div>
        <button 
          className="mobile-filter-btn"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
          Filters
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {/* ====== DESKTOP: PROFESSIONAL SIDEBAR ====== */}
      <aside className="filter-sidebar-pro">
        
        {/* Sidebar Header */}
        <div className="sidebar-header-pro">
          <div className="sidebar-title-wrap">
            <div className="sidebar-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </div>
            <div>
              <h3>Filters</h3>
              <p>{filteredCount} of {totalProducts} products</p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <button className="clear-btn-pro" onClick={clearAll} title="Clear all filters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* SORT BY SECTION */}
        <div className="sidebar-section-pro">
          <div className="sidebar-section-title">
            <span className="section-dot"></span>
            <h4>Sort By</h4>
          </div>
          <div className="sidebar-options-pro">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                className={`sidebar-option-btn ${sortBy === opt.value ? 'active' : ''}`}
                onClick={() => setSortBy(opt.value)}
              >
                <span className="option-icon">{opt.icon}</span>
                <span className="option-label">{opt.label}</span>
                {sortBy === opt.value && (
                  <span className="option-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE SECTION */}
        <div className="sidebar-section-pro">
          <div className="sidebar-section-title">
            <span className="section-dot"></span>
            <h4>Price Range</h4>
          </div>
          <div className="sidebar-options-pro">
            {priceRanges.map(range => (
              <button
                key={range.value}
                className={`sidebar-option-btn ${priceFilter === range.value ? 'active' : ''}`}
                onClick={() => setPriceFilter(range.value)}
              >
                <span className={`radio-circle ${priceFilter === range.value ? 'checked' : ''}`}></span>
                <span className="option-label">{range.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SIZE SECTION */}
        <div className="sidebar-section-pro">
          <div className="sidebar-section-title">
            <span className="section-dot"></span>
            <h4>Size</h4>
          </div>
          <div className="sidebar-size-grid-pro">
            {availableSizes.map(size => (
              <button
                key={size}
                className={`sidebar-size-btn-pro ${sizeFilter.includes(size) ? 'active' : ''}`}
                onClick={() => toggleSize(size)}
              >
                {size}
                {sizeFilter.includes(size) && (
                  <span className="size-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CLEAR ALL BUTTON (Bottom) */}
        {activeFiltersCount > 0 && (
          <button className="sidebar-clear-all-pro" onClick={clearAll}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            Clear All Filters
          </button>
        )}

      </aside>

      {/* ====== MOBILE: FILTER MODAL ====== */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-overlay" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="mobile-filter-panel" onClick={(e) => e.stopPropagation()}>
            
            <div className="mobile-filter-header">
              <h3>Filters</h3>
              <button className="close-filter" onClick={() => setIsMobileFilterOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mobile-filter-body">
              
              <div className="sidebar-section-pro">
                <div className="sidebar-section-title">
                  <span className="section-dot"></span>
                  <h4>Sort By</h4>
                </div>
                <div className="sidebar-options-pro">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`sidebar-option-btn ${sortBy === opt.value ? 'active' : ''}`}
                      onClick={() => setSortBy(opt.value)}
                    >
                      <span className="option-icon">{opt.icon}</span>
                      <span className="option-label">{opt.label}</span>
                      {sortBy === opt.value && (
                        <span className="option-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-section-pro">
                <div className="sidebar-section-title">
                  <span className="section-dot"></span>
                  <h4>Price Range</h4>
                </div>
                <div className="sidebar-options-pro">
                  {priceRanges.map(range => (
                    <button
                      key={range.value}
                      className={`sidebar-option-btn ${priceFilter === range.value ? 'active' : ''}`}
                      onClick={() => setPriceFilter(range.value)}
                    >
                      <span className={`radio-circle ${priceFilter === range.value ? 'checked' : ''}`}></span>
                      <span className="option-label">{range.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-section-pro">
                <div className="sidebar-section-title">
                  <span className="section-dot"></span>
                  <h4>Size</h4>
                </div>
                <div className="sidebar-size-grid-pro">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      className={`sidebar-size-btn-pro ${sizeFilter.includes(size) ? 'active' : ''}`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                      {sizeFilter.includes(size) && <span className="size-check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="mobile-filter-footer">
              <button className="clear-filters-mobile" onClick={clearAll}>
                Clear All
              </button>
              <button 
                className="apply-filters-mobile" 
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Show {filteredCount} Results
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FilterSort;