import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../configuration';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const productRef = ref(db, `products/${productId}`);
    onValue(productRef, (snapshot) => {
      setProduct({ id: productId, ...snapshot.val() });
      setLoading(false);
    });
  }, [productId]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  // Create array of images - main image plus any additional images
  const allImages = [
    product.imageUrl,
    ...(product.additionalImages || [])
  ];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: quantity
    });
  };

  return (
    <div className="product-detail-container">
      <div className="product-gallery">
        <div className="main-image">
          <img 
            src={allImages[selectedImage]} 
            alt={product.name} 
            className="featured-image"
          />
        </div>
        
      </div>

      <div className="product-info">
        <div className="product-header">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-meta">
            <span className="product-sku">SKU: {product.id}</span>
            {product.isNew && <span className="new-badge">New Arrival</span>}
            {product.isBestSeller && <span className="bestseller-badge">Bestseller</span>}
          </div>
        </div>

        <div className="price-container">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
          {product.originalPrice && (
            <span className="discount-badge">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice * 100))}%
            </span>
          )}
        </div>

        <div className="product-description">
          <p>{product.description}</p>
        </div>

        <div className="product-specs">
          <div className="spec-row">
            <span className="spec-label">Material:</span>
            <span className="spec-value">{product.material}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Category:</span>
            <span className="spec-value">{product.category}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Availability:</span>
            <span className={`spec-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {product.stock > 0 && (
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        )}

        
        <div className="delivery-info">
          <div className="delivery-option">
            <span className="icon">✈</span>
            <div>
              <h4>Free Shipping</h4>
              <p>On all orders over $100</p>
            </div>
          </div>
          <div className="delivery-option">
            <span className="icon">↻</span>
            <div>
              <h4>30-Day Returns</h4>
              <p>Hassle-free returns</p>
            </div>
          </div>
          <div className="delivery-option">
            <span className="icon">🔒</span>
            <div>
              <h4>Secure Payment</h4>
              <p>100% protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;