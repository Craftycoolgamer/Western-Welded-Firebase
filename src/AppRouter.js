import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
   const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="page-loading">Checking authentication...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="page-loading">Verifying permissions...</div>;
  }
  
  if (!currentUser || currentUser.email !== 'admin@example.com') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:category" element={<Layout><Products /></Layout>} />
        <Route path="/product/:productId" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/auth" element={<Layout><Auth /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <Layout>
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            </Layout>
          } 
        />
        
        {/* Checkout Process (protected route) */}
        <Route 
          path="/checkout" 
          element={
            <Layout>
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </Layout>
          } 
        />
        
        {/* 404 Page */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;