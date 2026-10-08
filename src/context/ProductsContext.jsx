import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { allProducts } from '../data/products';

const ProductsContext = createContext();

const PRODUCTS_KEY = 'signature_products';
const CATEGORIES_KEY = 'signature_categories';
const DEFAULT_CATEGORIES = ['T-Shirts', 'Kurtis'];

// "T-Shirts" === "tshirts" === "T Shirt" (normalization for filtering)
export const normalizeCategory = (cat = '') =>
  String(cat).toLowerCase().replace(/[^a-z0-9]/g, '');

export const matchCategory = (product, category) =>
  normalizeCategory(product?.category) === normalizeCategory(category);

const readStorage = (key, fallback) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved)) return saved;
  } catch {
    // corrupted JSON → use fallback
  }
  return fallback;
};

export const ProductsProvider = ({ children }) => {
  // ---------- products (localStorage first, fallback products.js) ----------
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // corrupted → reseed
      }
    }
    // First load → seed from static products.js
    const seeded = [...allProducts];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
    return seeded;
  });

  // ---------- categories ----------
  const [categories, setCategories] = useState(() => {
    const saved = readStorage(CATEGORIES_KEY, null);
    if (saved) return saved;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  });

  // persist products
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  // persist categories
  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const nextId = useCallback((list) => {
    const max = list.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
    return max + 1;
  }, []);

  // ---------- CRUD ----------
  const addProduct = useCallback((product) => {
    const created = {
      id: nextId(products),
      name: product.name.trim(),
      price: product.price,
      category: product.category,
      description: product.description || '',
      images: product.images?.length
        ? product.images
        : ['https://via.placeholder.com/800x1000?text=Signature+Libaas'],
      sizes: product.sizes?.length ? product.sizes : ['M', 'L'],
      badge: product.badge ? product.badge : null
    };
    setProducts(prev => [created, ...prev]);

    // auto-register new category
    if (product.category) {
      setCategories(prev =>
        prev.some(c => normalizeCategory(c) === normalizeCategory(product.category))
          ? prev
          : [...prev, product.category]
      );
    }
    return created;
  }, [products, nextId]);

  const updateProduct = useCallback((id, patch) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...patch, id: p.id } : p))
    );
    if (patch.category) {
      setCategories(prev =>
        prev.some(c => normalizeCategory(c) === normalizeCategory(patch.category))
          ? prev
          : [...prev, patch.category]
      );
    }
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetProducts = useCallback(() => {
    setProducts([...allProducts]);
  }, []);

  // ---------- categories helpers ----------
  const addCategory = useCallback((name) => {
    const clean = (name || '').trim();
    if (!clean) return { success: false, error: 'Category name is required.' };
    setCategories(prev => {
      if (prev.some(c => normalizeCategory(c) === normalizeCategory(clean))) return prev;
      return [...prev, clean];
    });
    return { success: true };
  }, []);

  const deleteCategory = useCallback((name) => {
    const inUse = products.some(p => normalizeCategory(p.category) === normalizeCategory(name));
    if (inUse) {
      return { success: false, error: 'Category has products. Move/delete them first.' };
    }
    setCategories(prev => prev.filter(c => normalizeCategory(c) !== normalizeCategory(name)));
    return { success: true };
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
