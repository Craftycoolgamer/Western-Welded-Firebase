import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../configuration';
import { useState, useEffect } from 'react';
import AdminProductCard from '../components/AdminProductCard';
import Base64Uploader from '../components/Base64Uploader';
import './AdminPanel.css';

function AdminPanel() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: null,
    description: '',
    imageUrl: '',
    // category: 'bracelets',
    material: 'steel',
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.entries(data).map(([id, product]) => ({ id, ...product })));
      }
    });

    const categoriesRef = ref(db, 'categories');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategories(Object.entries(data).map(([id, category]) => ({ id, ...category })));
      }
    });

  }, [updateTrigger]);


  const handleSave = () => {
    const categoriesRef = ref(db, 'categories/${category.id}');
    set(categoriesRef, categories)
      .then(() => {setShowCategoriesModal(false);})
  };



  const handleAddProduct = () => {
    const newProductRef = push(ref(db, 'products'));
    set(newProductRef, newProduct);
    
    setNewProduct({
      name: '',
      price: null,
      description: '',
      imageUrl: '',
      // category: 'bracelets',
      material: 'steel',
    });
    setIsFormOpen(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Product Management</h1>
        <div className="admin-actions">
          {/* <button 
            className="product-admin-btn"
            onClick={() => setShowCategoriesModal(true)}
          >
            Edit Categories
          </button> */}
          <button 
            className="product-admin-btn"
            onClick={() => setShowOrdersModal(true)}
          >
            View Orders
          </button>
          <button 
            className="add-product-btn"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Categories Modal
      {showCategoriesModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Product Categories</h2>
            <p>Category management functionality will be implemented here.</p>
            
            
            
            
            
            
            <div className="modal-actions">
              <button onClick={handleSave} className="save-btn">
                Save Changes
              </button>
              <button 
                className="modal-btn cancel"
                onClick={() => setShowCategoriesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Orders Modal */}
      {showOrdersModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Order History</h2>
            <p>Order history functionality will be implemented here.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowOrdersModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {isFormOpen && (
        <div className="product-form">
          <h2>Add New Product</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name*</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Price ($)*</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                min="0"
                step="1"
                required
              />
            </div>

            {/* <div className="form-group">
              <label>Category*</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="rings">Rings</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="flowers">Flowers</option>
              </select>
            </div> */}

            {/* <div className="form-group">
              <label>Material*</label>
              <select
                value={newProduct.material}
                onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
              >
                {/* <option value="gold">Gold</option> 
                <option value="steel">Steel</option>
                <option value="copper">Copper</option>
                <option value="copperandsteel">Copper & Steel</option>
              </select>
            </div> */}

            <div className="form-group full-width">
              <label>Product Image*</label>
              <Base64Uploader 
                onImageUpload={(base64String) => 
                  setNewProduct({...newProduct, imageUrl: base64String})
                }
                currentImage={newProduct.imageUrl}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows="3"
              />
            </div>

            {/* <div className="form-group full-width">
              <label>Available Sizes</label>
              <div className="size-management">
                <div className="size-inputs">
                  <input
                    type="text"
                    placeholder="Size Name"
                    id="newSizeName"
                    className="size-input"
                  />
                  <input
                    type="text"
                    placeholder="Measurement"
                    id="newSizeMeasurement"
                    className="size-input"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    id="newSizeStock"
                    min="1"
                    className="size-qty-input"
                  />
                  <button 
                    type="button"
                    className="add-size-btn"
                    onClick={() => {
                      const nameInput = document.getElementById('newSizeName');
                      const measurementInput = document.getElementById('newSizeMeasurement');
                      const stockInput = document.getElementById('newSizeStock');
                      const name = nameInput.value.trim().toUpperCase();
                      const measurement = measurementInput.value.trim();
                      const stock = parseInt(stockInput.value) || 0;
                      
                      if (name && !newProduct.sizes[name]) {
                        setNewProduct({
                          ...newProduct,
                          sizes: {
                            ...newProduct.sizes,
                            [name]: {
                              measurement,
                              stock
                            }
                          }
                        });
                        nameInput.value = '';
                        measurementInput.value = '';
                        stockInput.value = '';
                      }
                    }}
                  >
                    Add Size
                  </button>
                </div>
                
                {Object.keys(newProduct.sizes).length > 0 && (
                  <div className="selected-sizes">
                    <h4>Added Sizes:</h4>
                    <div className="size-tags">
                      {Object.entries(newProduct.sizes).map(([name, sizeInfo]) => (
                        <div key={name} className="size-tag">
                          <span>{name}</span>
                          <span>({sizeInfo.measurement})</span>
                          <span>{sizeInfo.stock} in stock</span>
                          <button
                            className="remove-size-btn"
                            onClick={() => {
                              const updatedSizes = { ...newProduct.sizes };
                              delete updatedSizes[name];
                              setNewProduct({
                                ...newProduct,
                                sizes: updatedSizes
                              });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>*/}
          </div>

          <button 
            className="submit-btn"
            onClick={handleAddProduct}
            disabled={!newProduct.name || !newProduct.imageUrl || !newProduct.price}
          >
            Add Product
          </button>
        </div>
      )}

      <div className="products-list">
        <h2>Current Products ({products.length})</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <AdminProductCard 
                key={product.id} 
                product={product}
                onUpdate={() => setUpdateTrigger(prev => prev + 1)}
              />
            ))}
          </div>
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;