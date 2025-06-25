import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from '../configuration';
import AdminProductCard from '../components/AdminProductCard';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: '',
    stock: 0
  });

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
      category: '',
      stock: 0
    });
  };

  const handleUpdateProduct = (productId, updatedData) => {
    set(ref(db, `products/${productId}`), updatedData);
  };

  const handleDeleteProduct = (productId) => {
    remove(ref(db, `products/${productId}`));
  };

  return (
    <div className="admin-panel">
      <h2>Product Management</h2>
      <div className="add-product-form">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      
      <div className="product-list">
        {products.map(product => (
          <AdminProductCard 
            key={product.id} 
            product={product} 
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;