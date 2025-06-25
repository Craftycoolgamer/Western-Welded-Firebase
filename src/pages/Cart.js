import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const handleQuantityChange = (id, e) => {
    updateQuantity(id, parseInt(e.target.value));
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>Your Jewelry Cart is Empty</h2>
          <p>Discover our exquisite collection and find something special</p>
          <Link to="/products" className="shop-btn">
            Browse Jewelry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-grid">
        <div className="cart-items">
          <h2>Your Shopping Bag</h2>
          
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-material">Material: {item.material}</p>
                  
                  <div className="quantity-controls">
                    <label>Qty:</label>
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e)}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <button className="clear-cart" onClick={clearCart}>
            Clear Entire Cart
          </button>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>${(cartTotal * 0.08).toFixed(2)}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>${(cartTotal * 1.08).toFixed(2)}</span>
          </div>
          
          <button className="checkout-btn">
            Proceed to Checkout
          </button>
          
          <div className="payment-methods">
            <img src="/images/visa.png" alt="Visa" />
            <img src="/images/mastercard.png" alt="Mastercard" />
            <img src="/images/amex.png" alt="American Express" />
            <img src="/images/paypal.png" alt="PayPal" />
          </div>
          
          <div className="secure-checkout">
            🔒 Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;