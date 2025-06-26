import { useState } from 'react';
import { ref, set, remove } from 'firebase/database';
import { db } from '../configuration';
import './AdminProductCard.css';

function AdminProductCard({ product, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newSizeStock, setNewSizeStock] = useState(1);

  const handleSave = () => {
    const productRef = ref(db, `products/${product.id}`);
    set(productRef, editedProduct)
      .then(() => {
        setIsEditing(false);
        onUpdate();
      });
  };

  const handleDelete = () => {
    const productRef = ref(db, `products/${product.id}`);
    remove(productRef)
      .then(() => {
        onUpdate();
      });
  };

  const addSize = () => {
    if (newSize && !editedProduct.sizes?.includes(newSize)) {
      setEditedProduct({
        ...editedProduct,
        sizes: [...(editedProduct.sizes || []), newSize],
        sizeStock: {
          ...(editedProduct.sizeStock || {}),
          [newSize]: newSizeStock
        }
      });
      setNewSize('');
      setNewSizeStock(1);
    }
  };

  const removeSize = (size) => {
    const updatedSizes = editedProduct.sizes?.filter(s => s !== size) || [];
    const updatedSizeStock = { ...editedProduct.sizeStock };
    delete updatedSizeStock[size];
    
    setEditedProduct({
      ...editedProduct,
      sizes: updatedSizes,
      sizeStock: updatedSizeStock
    });
  };

  return (
    <div className="admin-product-card">
      {!isEditing ? (
        <div className="product-view">
          <div className="product-image-container">
            <img 
              src={product.imageUrl || '/images/default-jewelry.jpg'} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/images/default-jewelry.jpg';
              }}
            />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="category">{product.category}</p>
            
            <div className="product-sizes">
              <strong>Sizes:</strong>
              {product.sizes?.length > 0 ? (
                <div className="size-tags">
                  {product.sizes.map(size => (
                    <span key={size} className="size-tag">
                      {size} ({product.sizeStock?.[size] || 0})
                    </span>
                  ))}
                </div>
              ) : (
                <span>No sizes</span>
              )}
            </div>
            
            <div className="product-actions">
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
          
          {showDeleteConfirm && (
            <div className="delete-confirmation">
              <p>Delete {product.name} permanently?</p>
              <div className="confirmation-buttons">
                <button 
                  onClick={handleDelete}
                  className="confirm-delete"
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="cancel-delete"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="product-edit">
          <h3>Edit Product</h3>
          
          <div className="form-group">
            <label>Name</label>
            <input
              value={editedProduct.name}
              onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value) || 0})}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              value={editedProduct.category}
              onChange={(e) => setEditedProduct({...editedProduct, category: e.target.value})}
            >
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="earrings">Earrings</option>
              <option value="bracelets">Bracelets</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Material</label>
            <select
              value={editedProduct.material}
              onChange={(e) => setEditedProduct({...editedProduct, material: e.target.value})}
            >
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editedProduct.description}
              onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Manage Sizes</label>
            <div className="size-input-group">
              <input
                type="text"
                placeholder="Size"
                className="size-input"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value.toUpperCase())}
              />
              <input
                type="number"
                placeholder="Qty"
                className="size-qty-input"
                value={newSizeStock}
                onChange={(e) => setNewSizeStock(parseInt(e.target.value) || 0)}
                min="1"
              />
              <button 
                type="button"
                className="add-size-btn"
                onClick={addSize}
              >
                Add Size
              </button>
            </div>
            
            {editedProduct.sizes?.length > 0 && (
              <div className="selected-sizes">
                <div className="size-tags">
                  {editedProduct.sizes.map(size => (
                    <div key={size} className="size-tag">
                      <span>{size}</span>
                      <span>({editedProduct.sizeStock?.[size] || 0})</span>
                      <button onClick={() => removeSize(size)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductCard;