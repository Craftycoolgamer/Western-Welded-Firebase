import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.imageUrl || '/images/default-jewelry.jpg'} 
            alt={product.name} 
            className="product-image"
            onError={(e) => {
              e.target.src = '/images/default-jewelry.jpg';
            }}
          />
          {product.stock <= 0 && (
            <div className="out-of-stock-banner">Out of Stock</div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <div className="product-price">${product.price.toFixed(2)}</div>
          {product.originalPrice && (
            <div className="original-price">
              ${product.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
      </Link>
      <button 
        className="add-to-cart-btn"
        onClick={() => addToCart(product)}
        disabled={product.stock <= 0}
      >
        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;