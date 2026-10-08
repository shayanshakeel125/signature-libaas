import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import Toaster from './components/Toaster';
import Home from './pages/Home';
import About from './pages/About';
import TShirts from './pages/TShirts';
import Kurtis from './pages/Kurtis';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import TrackOrder from './pages/TrackOrder';
import OrderSuccess from './pages/OrderSuccess';

// Admin
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminSettings from './pages/Admin/AdminSettings';
import { AdminRoute } from './pages/Admin/AdminLayout';

// 🎯 Page change aur refresh par scroll top
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Page change par
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Extra safety - 10ms baad bhi
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      <ScrollToTopOnNavigate />

      {/* Storefront navbar/footer admin me nahi dikhta (sidebar layout hota hai) */}
      {!isAdminRoute && <Navbar />}

      <main className={isAdminRoute ? 'admin-viewport' : 'main-content'}>
        <Routes>
          {/* ===== STOREFRONT ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tshirts" element={<TShirts />} />
          <Route path="/kurtis" element={<Kurtis />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />

          {/* ===== ADMIN (protected) ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}

      <ScrollToTop />
      <Toaster />
    </div>
  );
}
