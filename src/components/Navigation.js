import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navigation() {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="main-nav">
      <Link to="/" className="logo">Jewelry Store</Link>
      
      <div className="nav-links">
        <Link to="/products">Shop</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        
        {currentUser ? (
          <>
            {currentUser.isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;