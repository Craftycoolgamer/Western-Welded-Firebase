import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../configuration';
import { useState, useEffect } from 'react';
import AdminProductCard from '../components/AdminProductCard';
import Base64Uploader from '../components/Base64Uploader';
import './AdminPanel.css';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: 'rings',
    material: 'gold',
    sizes: [],
    sizeStock: {}
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.entries(data).map(([id, product]) => ({ id, ...product })));
      }
    });
  }, [updateTrigger]);

  const handleAddProduct = () => {
    const productToAdd = {
      ...newProduct,
      stock: newProduct.sizes.length > 0 
        ? Object.values(newProduct.sizeStock).reduce((a, b) => a + b, 0)
        : 1
    };

    const newProductRef = push(ref(db, 'products'));
    set(newProductRef, productToAdd);
    
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      category: 'rings',
      material: 'gold',
      sizes: [],
      sizeStock: {}
    });
    setIsFormOpen(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Product Management</h1>
        <button 
          className="add-product-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

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
                // min="0"
                step="1"
                required
                placeholder='0'
              />
            </div>

            <div className="form-group">
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
            </div>

            <div className="form-group">
              <label>Material*</label>
              <select
                value={newProduct.material}
                onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
              >
                {/* <option value="gold">Gold</option> */}
                <option value="silver">Steel</option>
                <option value="platinum">Copper</option>
                {/* <option value="diamond">Diamond</option> */}
              </select>
            </div>

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

            <div className="form-group full-width">
              <label>Available Sizes</label>
              <div className="size-management">
                <div className="size-inputs">
                  <input
                    type="text"
                    placeholder="Size"
                    id="newSize"
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
                      const sizeInput = document.getElementById('newSize');
                      const stockInput = document.getElementById('newSizeStock');
                      const size = sizeInput.value.trim().toUpperCase();
                      const stock = parseInt(stockInput.value) || 0;
                      
                      if (size && !newProduct.sizes.includes(size)) {
                        setNewProduct({
                          ...newProduct,
                          sizes: [...newProduct.sizes, size],
                          sizeStock: {
                            ...newProduct.sizeStock,
                            [size]: stock
                          }
                        });
                        sizeInput.value = '';
                        stockInput.value = '';
                      }
                    }}
                  >
                    Add Size
                  </button>
                </div>
                
                {newProduct.sizes.length > 0 && (
                  <div className="selected-sizes">
                    <h4>Added Sizes:</h4>
                    <div className="size-tags">
                      {newProduct.sizes.map(size => (
                        <div key={size} className="size-tag">
                          <span>{size}</span>
                          <span>({newProduct.sizeStock[size] || 0})</span>
                          <button
                            onClick={() => {
                              const updatedSizes = newProduct.sizes.filter(s => s !== size);
                              const updatedSizeStock = {...newProduct.sizeStock};
                              delete updatedSizeStock[size];
                              setNewProduct({
                                ...newProduct,
                                sizes: updatedSizes,
                                sizeStock: updatedSizeStock
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
            </div>
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