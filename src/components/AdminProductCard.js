import React, { useState } from 'react';

function AdminProductCard({ product, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleSave = () => {
    onUpdate(product.id, editedProduct);
    setIsEditing(false);
  };

  return (
    <div className="admin-product-card">
      {isEditing ? (
        <div className="edit-form">
          <input
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
          />
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="product-display">
          <img src={product.imageUrl} alt={product.name} width="100" />
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
          <div className="actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductCard;