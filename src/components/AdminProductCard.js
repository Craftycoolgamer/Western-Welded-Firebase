import React, { useState } from 'react';
import { ref, set, remove } from 'firebase/database';
import { db } from '../configuration';
import './AdminProductCard.css';

function AdminProductCard({ product }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    set(ref(db, `products/${product.id}`), editedProduct);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      remove(ref(db, `products/${product.id}`));
    }
  };

  if (isDeleting) return null;

  return (
    <div className="admin-product-card">
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input
              value={editedProduct.name}
              className='input-field'
              onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={editedProduct.price}
              className='input-field'
              onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={editedProduct.stock}
              className='input-field'
              onChange={(e) => setEditedProduct({...editedProduct, stock: parseInt(e.target.value)})}
            />
          </div>
          <div className="button-group">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="product-display">
          <div className="product-image-container">
            <img src={product.imageUrl} alt={product.name} />
            <div className="product-badge">{product.category}</div>
          </div>
          <div className="product-info">
            <h4>{product.name}</h4>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="stock">{product.stock} in stock</p>
            <div className="product-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductCard;