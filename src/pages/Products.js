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
      const allProducts = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }));
      
      setProducts(
        category 
          ? allProducts.filter(p => p.category === category) 
          : allProducts
      );
      setLoading(false);
    });
  }, [category]);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products-page">
      <h1>{category || 'All Jewelry'}</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;