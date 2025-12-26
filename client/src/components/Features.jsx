import React from "react";
import './Features.css'
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate=useNavigate();
  return (
    <section className="feature">
      <h2 className="heading">Why Choose ParkSmart?</h2>
      <div className="feature-item">
        <strong>Smart Navigation</strong>
        <p>Navigates to the nearest available spot</p>

      </div>
      <div className="feature-item">
        <strong> Real-time Updates</strong>
        <p>Know availability before you reach</p>
      </div>
      <div className="feature-item">
        <strong>Secure Booking</strong>
        <p>Reserve your space in seconds</p>
      </div>
      <div className="features">
      <button className="btn-dark">Join ParkSmart</button>
      <button className="btn-light" onClick={() => navigate('/location')}>View Location</button>
      </div>
    </section>

  );
  
}
export default Features
