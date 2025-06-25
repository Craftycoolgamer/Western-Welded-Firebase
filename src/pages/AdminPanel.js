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
    stock: 1,
    material: 'gold'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.entries(data).map(([id, product]) => ({ id, ...product })));
      }
    });
  }, []);

  const handleAddProduct = () => {
    const newProductRef = push(ref(db, 'products'));
    set(newProductRef, newProduct);
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      category: 'rings',
      stock: 1,
      material: 'gold'
    });
    setIsFormOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Product Management</h2>
        <div className="admin-actions">
          {/* <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div> */}
          <button 
            className="add-product-toggle"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="add-product-form">
          <h3>Add New Jewelry Item</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name*</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
                className='input-field'
              />
            </div>

            <div className="form-group">
              <label>Price ($)*</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                min="0"
                step="0.01"
                required
                className='input-field'
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
              </select>
            </div>

            <div className="form-group">
              <label>Material*</label>
              <select
                value={newProduct.material}
                onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stock*</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                min="1"
                required
                className='input-field'
              />
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
                className='input-field'
              />
            </div>
          </div>

          <button 
            className="add-product-btn"
            onClick={handleAddProduct}
            disabled={!newProduct.name || !newProduct.imageUrl || !newProduct.price}
          >
            Add Product
          </button>
        </div>
      )}

      <div className="products-list">
        <h3>Current Products ({filteredProducts.length})</h3>
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <AdminProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        ) : (
          <p className="no-products">
            {true ? 'No matching products found' : 'No products available'}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;