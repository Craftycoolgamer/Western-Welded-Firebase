import { useState } from 'react';
import { ref, set, remove } from 'firebase/database';
import { db } from '../configuration';
import './AdminProductCard.css';

function AdminProductCard({ product, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [newSizeName, setNewSizeName] = useState('');
  // const [newSizeMeasurement, setNewSizeMeasurement] = useState('');
  // const [newSizeStock, setNewSizeStock] = useState(1);

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

  // const addSize = () => {
  //   if (newSizeName && !editedProduct.sizes?.[newSizeName]) {
  //     setEditedProduct({
  //       ...editedProduct,
  //       sizes: {
  //         ...editedProduct.sizes,
  //         [newSizeName]: {
  //           measurement: newSizeMeasurement,
  //           stock: newSizeStock
  //         }
  //       }
  //     });
  //     setNewSizeName('');
  //     setNewSizeMeasurement('');
  //     setNewSizeStock(1);
  //   }
  // };

  // const removeSize = (sizeName) => {
  //   const updatedSizes = { ...editedProduct.sizes };
  //   delete updatedSizes[sizeName];
    
  //   setEditedProduct({
  //     ...editedProduct,
  //     sizes: updatedSizes
  //   });
  // };

  return (
    <div className="admin-product-card">
      {!isEditing ? (
        <div className="product-view">
          <div className="product-image-container">
            {product.stock == false && (
              <div className="out-of-stock-banner-admin">Out of Stock</div>
            )}
            <img 
              src={product.imageUrl || '/images/default-jewelry.jpg'} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/images/default.jpg';
              }}
            />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="category">{product.category}</p>
            

            {/* <div className="product-sizes">
              <strong>Sizes:</strong>
              {product.sizes && Object.keys(product.sizes).length > 0 ? (
                <div className="size-tags">
                  {Object.entries(product.sizes).map(([sizeName, sizeInfo]) => (
                    <span key={sizeName} className="size-tag">
                      {sizeName} ({sizeInfo.measurement}) - {sizeInfo.stock} available
                    </span>
                  ))}
                </div>
              ) : (
                <span>No sizes</span>
              )}
            </div> */}
            
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
              step="1"
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
              <option value="copper">copper</option>
              <option value="steel">Steel</option>
              <option value="copper&steel">Copper & Steel</option>
              {/* <option value="diamond">Diamond</option> */}
            </select>
          </div>

          <div className="form-group">
            <label>Order</label>
            <select
              value={editedProduct.stock}
              onChange={(e) => setEditedProduct({...editedProduct, stock: e.target.value === 'true'})}
            >
              <option value="true">Ready to Order</option>
              <option value="false">Not Ready to Order</option>
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
          
          {/* <div className="form-group">
            <label>Manage Sizes</label>
            <div className="size-input-group">
              <input
                type="text"
                placeholder="Size Name"
                className="size-input"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value.toUpperCase())}
              />
              <input
                type="text"
                placeholder="Measurement"
                className="size-input"
                value={newSizeMeasurement}
                onChange={(e) => setNewSizeMeasurement(e.target.value)}
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
            {editedProduct.sizes && Object.keys(editedProduct.sizes).length > 0 && (
            <div className="selected-sizes">
              <div className="size-tags">
                {Object.entries(editedProduct.sizes).map(([sizeName, sizeInfo]) => (
                  <div key={sizeName} className="size-tag">
                    <span>{sizeName}</span>
                    <span>({sizeInfo.measurement})</span>
                    <span>{sizeInfo.stock} in stock</span>
                    <button 
                      className='remove-size-btn'
                      onClick={() => removeSize(sizeName)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}
          
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