import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Create this for styling

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, had its name changed,
          is being worked on, or is temporarily unavailable.
        </p>
        <div className="action-buttons">
          <Link to="/" className="home-btn">Return Home</Link>
          <Link to="/products" className="shop-btn">Browse Jewelry</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;