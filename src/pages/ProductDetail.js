import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../configuration';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const { showNotification } = useNotification();
  const { addToCart } = useCart();

  useEffect(() => {
    const productRef = ref(db, `products/${productId}`);
    onValue(productRef, (snapshot) => {
      const productData = snapshot.val();
      setProduct({ 
        id: productId, 
        ...productData,
      });
      setLoading(false);
    });
  }, [productId]);

  const handleAddToCart = () => {
    // Validate size is selected
    if (selectedSize === '') {
      showNotification('Please select a size', 'error');
      return;
    }

    // // Check stock availability
    // const availableStock = selectedSize 
    //   ? product.sizes[selectedSize]?.stock || 0 
    //   : product.stock || 0;
      
    // if (quantity > availableStock) {
    //   showNotification(`Only ${availableStock} available in this size`, 'error');
    //   return;
    // }

    addToCart({
      ...product,
      quantity: quantity,
      selectedSize: selectedSize
    });
    
    showNotification(
      `${quantity} ${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''} added to cart!`,
      'success'
    );
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="main-image">
          <img 
          src={product.imageUrl || '/images/default-jewelry.jpg'} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = '/images/default-jewelry.jpg';
          }}
        />
        {product.isNew && <span className="new-badge">New</span>}
        {!product.stock && <span className="out-of-stock-badge">Out of Stock</span>}
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
          
        </div>

        {/* Description */}
        { product.description != "" && (
          <div className="product-description">
            <p>{product.description}</p>
          </div>
        )}
        

        {/* Product Specifications */}
        <div className="product-specs">
          {/* <div className="spec-row">
            <span className="spec-label">Material:</span>
            <span className="spec-value">{product.material}</span>
          </div> */}
          {/* <div className="spec-row">
            <span className="spec-label">Category:</span>
            <span className="spec-value">{product.category}</span>
          </div> */}
          <div className="spec-row">
            <span className="spec-label">Availability:</span>
            <span className={`spec-value ${product.stock ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock ? `Order now` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Size Selector */}
        {/* {product.sizes && Object.keys(product.sizes).length > 0 && (
          <div className="size-selector-section">
            <h3>Select Size</h3>
            <div className="size-options">
              {Object.entries(product.sizes).map(([sizeName, sizeInfo]) => {
                const sizeAvailable = sizeInfo.stock;
                return (
                  <button
                    key={sizeName}
                    className={`size-option ${
                      selectedSize === sizeName ? 'selected' : ''
                    } ${
                      sizeAvailable <= 0 ? 'out-of-stock' : ''
                    }`}
                    onClick={() => setSelectedSize(sizeName)}
                    disabled={sizeAvailable <= 0}
                  >
                    {sizeName} ({sizeInfo.measurement})
                    {sizeAvailable <= 0 && <span className="stock-badge">Out of stock</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )} */}

        {/* Quantity Selector */}
        {product.stock && (
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
                onClick={handleIncrement}
                // disabled={quantity >= (
                //   selectedSize 
                //     ? product.sizes[selectedSize]?.stock || 0 
                //     : product.stock || 0
                // )}
                disabled={quantity >= 100}
              >
                +
              </button>
            </div>

            <div className="size-selector">
              <label htmlFor="size-select">Size:</label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="size-dropdown"
              >
                <option value="">Select a size</option>
                <option value="5.5">5 1/2 inch</option>
                <option value="5.75">5 3/4 inch</option>
                <option value="6">6 inch</option>
                <option value="6.25">6 1/4 inch</option> 
                <option value="6.5">6 1/2 inch</option>
                <option value="6.75">6 3/4 inch</option>
                <option value="7">7 inch</option>
                <option value="7.25">7 1/4 inch</option>
                <option value="7.5">7 1/2 inch</option>
                <option value="7.75">7 3/4 inch</option>
                <option value="8">8 inch</option>
                <option value="8.25">8 1/4 inch</option>
                <option value="8.5">8 1/2 inch</option>
                <option value="8.75">8 3/4 inch</option>
                <option value="9">9 inch</option>
              </select>
            </div>


            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={
                (!selectedSize)
              }
            >
              {
                (!selectedSize)
                    ? 'Please Select Size'
                    : 'Add to Cart'
              }
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
          
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;