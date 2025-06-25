import AppRouter from './AppRouter';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-container">
          <AppRouter />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;