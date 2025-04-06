import React, { useState, useEffect } from 'react';
import { getHello } from '../api/apiService';
import './Home.css';

function Home() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHello();
        setMessage(data.message || JSON.stringify(data));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data from backend');
        setMessage('Error occurred');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to IsItEmpty</h1>
      <p>Find available parking spaces in real-time</p>
      
      <div className="card">
        <h2>Backend Connection Test</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <p>Message from backend: {message}</p>
        )}
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>Real-time Updates</h3>
          <p>Get up-to-date information about parking availability</p>
        </div>
        <div className="feature">
          <h3>Easy Navigation</h3>
          <p>Find the best parking spot with our intuitive interface</p>
        </div>
        <div className="feature">
          <h3>Save Time</h3>
          <p>No more driving around looking for parking</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
