import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './NavigationBar.css';

function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const { cart = [] } = useCart();
  const navigate = useNavigate();
  

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <img className="logo-icon" src="/images/Western_Welded_logo.svg" />
          {/* <span className="logo-text">Western Welded</span> */}
        </Link>

        <div className="nav-content">
          
{/* Main Navigation Links */}
        <div className="navbar-links">
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Right-side Icons */}
        <div className="navbar-icons">
          {/* Admin Access (only shows for admin users) */}
          {currentUser?.email === 'admin@example.com' && (
            <button 
              onClick={handleAdminClick}
              className="admin-btn"
            >
              Admin
            </button>
          )}

          {/* User Account */}
          {currentUser ? (
            <div className="user-dropdown">
              <span className="user-icon">👤</span>
              <div className="dropdown-content">
                <Link to="/account">My Account</Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="auth-link">Login</Link>
          )}

          {/* Shopping Cart */}
          <Link to="/cart" className="cart-link">
            🛒
            {cart.length > 0 && (
              <span className="cart-count">{cartItemCount}</span>            )}
          </Link>
        </div>

        </div>
        
      </div>
    </nav>
  );
}

export default NavigationBar;