import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSort from '../components/FilterSort';
import { useProducts, matchCategory } from '../context/ProductsContext';

const TShirts = () => {
  const { products: allProducts } = useProducts();
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState([]);

  const parsePrice = (priceStr) => parseInt(String(priceStr).replace(/[^0-9]/g, '')) || 0;

  const categoryProducts = useMemo(
    () => allProducts.filter(p => matchCategory(p, 'tshirts')),
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    let products = [...categoryProducts];

    if (priceFilter !== 'all') {
      products = products.filter(p => {
        const price = parsePrice(p.price);
        if (priceFilter === 'under-1500') return price < 1500;
        if (priceFilter === '1500-3000') return price >= 1500 && price <= 3000;
        if (priceFilter === '3000-5000') return price > 3000 && price <= 5000;
        if (priceFilter === 'above-5000') return price > 5000;
        return true;
      });
    }

    if (sizeFilter.length > 0) {
      products = products.filter(p => 
        p.sizes && p.sizes.some(size => sizeFilter.includes(size))
      );
    }

    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'price-high':
        products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'name-az':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return products;
  }, [categoryProducts, sortBy, priceFilter, sizeFilter]);

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>👕 <span>T-Shirts</span> Collection</h1>
        <p>Premium quality streetwear for every occasion</p>
      </div>

      {/* ✅ NAYI STRUCTURE - Sidebar aur Products ek saath */}
      <div className="products-with-sidebar">
        
        <FilterSort 
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          sizeFilter={sizeFilter}
          setSizeFilter={setSizeFilter}
          availableSizes={['S', 'M', 'L', 'XL']}
          totalProducts={categoryProducts.length}
          filteredCount={filteredProducts.length}
        />

        <div className="products-main">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="big-icon">🔍</div>
              <h3>No Products Found</h3>
              <p>{categoryProducts.length === 0 ? 'New T-Shirts are coming soon!' : 'Try changing your filters'}</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirts;