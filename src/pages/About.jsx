import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About IsItEmpty</h1>
      <p className="intro">
        IsItEmpty is a modern solution for finding available parking spaces in real-time.
        Our mission is to make parking easier and more efficient for everyone.
      </p>
      
      <div className="about-section">
        <h2>Our Story</h2>
        <p>
          IsItEmpty was founded in 2025 with a simple goal: to eliminate the frustration of finding parking.
          We've all been there - driving around in circles, wasting time and fuel, just to find a parking spot.
          Our team decided to solve this problem using modern technology.
        </p>
      </div>
      
      <div className="about-section">
        <h2>How It Works</h2>
        <p>
          IsItEmpty uses a network of sensors and cameras to monitor parking lots and provide real-time data
          about available spaces. Our advanced algorithms process this data and present it in an easy-to-use
          interface, helping you find parking quickly and efficiently.
        </p>
      </div>
      
      <div className="about-section">
        <h2>Our Team</h2>
        <p>
          We are a dedicated team of engineers, designers, and parking enthusiasts committed to making
          parking easier for everyone. Our diverse backgrounds and expertise allow us to approach the
          parking problem from multiple angles.
        </p>
      </div>
    </div>
  );
}

export default About;
