import React from 'react';
import './Hero.css';
import parkingImage from '../assets/Parking.jpg';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Smart Assistant for Easy Parking</h1>
        <p>Find and reserve parking in seconds. Save time, avoid hassle, and park smarter with ParkSmart</p>
        <button className="btn-dark">Book Now</button>
        <img src={parkingImage} alt="Parking Lot" className="hero-image" />
      </div>
    </section>
  );
};

export default Hero;
