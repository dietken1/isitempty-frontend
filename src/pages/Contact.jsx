import React, { useState } from 'react';
import { sendContactMessage } from '../api/apiService';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    sendContactMessage(formData)
      .then((data) => {
        if (data.success) {
          setFormStatus('success');
          setFormData({
            name: '',
            email: '',
            message: ''
          });
        } else {
          setFormStatus('error'); 
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        setFormStatus('error');
      });

    setTimeout(() => {
      setFormStatus(null);
    }, 5000);
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        Have questions or feedback? We'd love to hear from you!
      </p>
      
      {formStatus === 'success' && (
        <div className="success-message">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-button">Send Message</button>
      </form>
      
      <div className="contact-info">
        <h2>Other Ways to Reach Us</h2>
        <div className="info-item">
          <strong>Email:</strong> info@isitempty.kr
        </div>
      </div>
    </div>
  );
}

export default Contact;