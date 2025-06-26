import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ref, onValue } from 'firebase/database';
import { db } from '../configuration';
import { useEffect, useState } from 'react';

function Products() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allProducts = Object.entries(data).map(([id, product]) => ({
          id,
          ...product,
          // Calculate total stock for each product
          stock: product.sizes 
            ? Object.values(product.sizes).reduce((sum, size) => sum + (size.stock || 0), 0)
            : product.stock || 0
        }));
        
        setProducts(
          category 
            ? allProducts.filter(p => p.category === category) 
            : allProducts
        );
      }
      setLoading(false);
    });
  }, [category]);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products-page">
      <h1>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;