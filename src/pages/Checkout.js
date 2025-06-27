import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
// import { loadStripe } from '@stripe/stripe-js';

const Checkout = () => {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [card, setCard] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Stripe and Elements
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Load Expitrans.js (using Stripe-compatible API)
        const stripeInstance = 0 //await loadStripe(process.env.REACT_APP_EXPITRANS_PUBLIC_KEY);
        const elementsInstance = stripeInstance.elements();
        
        // Create card element
        const cardElement = elementsInstance.create('card', { 
          hidePostalCode: true 
        });
        
        setStripe(stripeInstance);
        setElements(elementsInstance);
        setCard(cardElement);
      } catch (err) {
        console.error('Failed to initialize Expitrans:', err);
        setError('Payment system initialization failed');
      }
    };

    initializeStripe();
  }, []);

  // Mount card element
  useEffect(() => {
    if (card) {
      card.mount('#card-element');
      card.on('change', handleCardChange);
    }

    return () => {
      if (card) card.destroy();
    };
  }, [card]);

  // Create payment intent
  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      const functions = getFunctions();
      const createIntent = httpsCallable(functions, 'createExpitransIntent');
      const { data } = await createIntent({ 
        amount: 1000 // Amount in cents
      });
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error('Payment intent creation failed:', err);
      setError('Could not initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardChange = (event) => {
    setError(event.error?.message || '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.line1,
                line2: billingDetails.line2,
                city: billingDetails.city,
                state: billingDetails.state,
                postal_code: billingDetails.postal_code,
                country: billingDetails.country
              }
            }
          }
        },
        { handleActions: false }
      );

      if (confirmError) {
        setError(confirmError.message);
      } else if (paymentIntent) {
        alert(`Payment status: ${paymentIntent.status}\nMessage: ${paymentIntent.charges.data[0].outcome.seller_message}`);
        // Process successful payment here
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError('Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Complete Your Payment</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Card Details */}
        <div className="form-section">
          <label>Card Details</label>
          <div id="card-element" className="card-input" />
          <div id="card-errors" className="error">{error}</div>
        </div>

        {/* Billing Details */}
        <div className="form-section">
          <h3>Billing Information</h3>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={billingDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={billingDetails.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={billingDetails.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              name="line1"
              value={billingDetails.line1}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              name="line2"
              value={billingDetails.line2}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={billingDetails.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={billingDetails.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={billingDetails.postal_code}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={billingDetails.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="pay-button"
        >
          {isLoading ? 'Processing...' : `Pay $10.00`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;