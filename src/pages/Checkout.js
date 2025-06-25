// Checkout.js
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('your_publishable_key');

function Checkout({ cart }) {
  const handleClick = async () => {
    // const stripe = await stripePromise;
    
    // const response = await fetch('/create-checkout-session', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ cart }),
    // });
    
  //   const session = await response.json();
  //   const result = await stripe.redirectToCheckout({
  //     sessionId: session.id,
  //   });
    
  //   if (result.error) {
  //     console.error(result.error.message);
  //   }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="shipping-form">
        {/* Address form fields */}
      </div>
      <div className="payment-method">
        <h3>Payment</h3>
        <button onClick={handleClick}>Pay with Card</button>
      </div>
    </div>
  );
}

export default Checkout; 