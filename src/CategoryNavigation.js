// CategoryNavigation.js
function CategoryNavigation() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const categoriesRef = ref(db, 'categories');
    onValue(categoriesRef, (snapshot) => {
      setCategories(snapshot.val());
    });
  }, []);

  return (
    <nav className="category-nav">
      <ul>
        <li><Link to="/products">All Jewelry</Link></li>
        {categories.map(cat => (
          <li key={cat.id}>
            <Link to={`/products/${cat.slug}`}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ProductsPage.js
function ProductsPage() {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const allProducts = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data
      }));
      
      if (category) {
        setFilteredProducts(allProducts.filter(p => p.category === category));
      } else {
        setFilteredProducts(allProducts);
      }
    });
  }, [category]);

  // Render product grid...
}