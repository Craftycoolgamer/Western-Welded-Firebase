// ProductDetail.js
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../configuration';
import React, { useEffect, useState } from "react";
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const productRef = ref(db, `products/${productId}`);
    onValue(productRef, (snapshot) => {
      setProduct({ id: productId, ...snapshot.val() });
      setLoading(false);
    });
  }, [productId]);

  return (
    <div className="product-detail">
      {product && (
        <>
          <div className="product-gallery">
            <img src={product.imageUrl} alt={product.name} />
            {/* Add thumbnail navigation for multiple images */}
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="price">${product.price.toFixed(2)}</div>
            <p className="description">{product.description}</p>
            <div className="product-meta">
              <span>Material: {product.material}</span>
              <span>Stone: {product.stoneType}</span>
              <span>Stock: {product.stock}</span>
            </div>
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductDetail;