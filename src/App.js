import AppRouter from './AppRouter';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <CartProvider>
        <div className="app-container">
          <AppRouter />
        </div>
      </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;