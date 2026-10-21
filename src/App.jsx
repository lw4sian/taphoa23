import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { SlideProvider } from './context/SlideContext';
import { DepositProvider } from './context/DepositContext';
import { GiftcodeProvider } from './context/GiftcodeContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingSocial from './components/FloatingSocial';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DepositPage from './pages/DepositPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <SlideProvider>
            <DepositProvider>
              <GiftcodeProvider>
                <CartProvider>
                  <BrowserRouter>
                    <ScrollToTop />
                    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <Navbar />
                      <main style={{ flex: 1 }}>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/product/:id" element={<ProductDetailPage />} />
                          <Route path="/categories" element={<CategoriesPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/deposit" element={<DepositPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/login.html" element={<LoginPage />} />
                          <Route path="/admin" element={<AdminPage />} />
                          <Route path="/admin.html" element={<AdminPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="*" element={<HomePage />} />
                        </Routes>
                      </main>
                      <Footer />
                      <FloatingSocial />
                    </div>
                  </BrowserRouter>
                </CartProvider>
              </GiftcodeProvider>
            </DepositProvider>
          </SlideProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
