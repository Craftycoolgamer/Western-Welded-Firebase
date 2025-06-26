import React from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../configuration';
import { useEffect, useState } from 'react';
import './Home.css'; // Create this for styling

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const allProducts = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }));
      
      // Get 4 random featured products
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Luxury Handcrafted Jewelry</h1>
          <p>Discover our exquisite collection of fine jewelry pieces</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Collection</h2>
        {loading ? (
          <div className="loading">Loading featured items...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className='product-link'>
                  <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <h3>{product.name}</h3>
                  <p className="price">${product.price.toFixed(2)}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      
    </div>
  );
}

export default Home;