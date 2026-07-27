import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './auth/AuthContext';
import { ProductProvider } from './context/ProductContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Auth from './pages/Auth/Auth';
import Account from './pages/Account/Account';
import Categories from './pages/Categories/Categories';
import Migrate from './pages/Migrate';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';

// Styles
import './index.css';
import './App.css';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#222', color: '#ff5555', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Something went wrong in React!</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            <summary>Click to view error details</summary>
            <br />
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <ProductProvider>
              <Router>
                <Routes>
                {/* Admin Dashboard — No Header/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminLayout />} />

                {/* Main Store */}
                <Route path="*" element={
                  <div className="app">
                    <Header />
                    <Routes>
                      {/* Main Store Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/checkout/success" element={<CheckoutSuccess />} />

                      {/* Auth Routes */}
                      <Route path="/login" element={<Auth />} />
                      <Route path="/register" element={<Auth />} />

                      {/* Account */}
                      <Route path="/account" element={<Account />} />
                      <Route path="/account/*" element={<Account />} />

                      <Route path="/migrate" element={<Migrate />} />

                      {/* Placeholder routes */}
                      <Route path="/about" element={<PlaceholderPage title="About Us" />} />
                      <Route path="/contact" element={<PlaceholderPage title="Contact" />} />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                  </div>
                } />
                </Routes>
              </Router>
            </ProductProvider>
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

// Checkout Success Page
function CheckoutSuccess() {
  return (
    <main style={{
      paddingTop: 'calc(var(--header-height) + 4rem)',
      paddingBottom: '4rem',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Thank you for your purchase. We've sent a confirmation email with your order details.
          Your items will be shipped within 2-3 business days.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" className="btn btn-primary">Continue Shopping</a>
          <a href="/account" className="btn btn-secondary">View Orders</a>
        </div>
      </div>
    </main>
  );
}

// Placeholder Page
function PlaceholderPage({ title }) {
  return (
    <main style={{
      paddingTop: 'calc(var(--header-height) + 4rem)',
      paddingBottom: '4rem',
      minHeight: '100vh'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          This page will be available when connected to the backend.
        </p>
      </div>
    </main>
  );
}

// 404 Page
function NotFound() {
  return (
    <main style={{
      paddingTop: 'calc(var(--header-height) + 4rem)',
      paddingBottom: '4rem',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </main>
  );
}

export default App;
