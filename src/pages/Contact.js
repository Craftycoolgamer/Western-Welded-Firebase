import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    try {
      const functions = getFunctions();
      const sendMessage = httpsCallable(functions, 'sendContactMessage');
      await sendMessage(formData);
      
      setStatus({ loading: false, message: 'Message sent successfully!', error: '' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus({ 
        loading: false, 
        message: '', 
        error: error.message || 'Failed to send message. Please try again.' 
      });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-info">
        <h1>Contact Us</h1>
        <p>Email: contact@westernwelded.com</p>
        <p>Phone: (555) 123-4567</p>
        <p>Address: 123 Welding Way, Metalville, MW 12345</p>
      </div>
      
    </div>
  );
}

export default Contact;