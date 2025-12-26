import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About ParkSmart</h1>
      <p className="about-description">
        ParkSmart is a modern parking management system designed to ease urban traffic congestion
        through real-time availability and smart booking features. Our platform helps drivers quickly
        locate available parking spots, reducing time, stress, and fuel usage.
      </p>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to simplify urban mobility by integrating smart parking solutions
          into everyday commuting. We aim to reduce unnecessary traffic and make cities more efficient and livable.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Provide</h2>
        <p>
          ParkSmart offers a user-friendly web platform that allows users to:
        </p>
        <ul>
          <li>View real-time availability of parking spots</li>
          <li>Search for nearby parking zones</li>
          <li>Book parking slots in advance</li>
          <li>Navigate directly to available spaces using integrated maps</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Why Choose ParkSmart?</h2>
        <p>
          We combine technology and convenience to create a parking system that works for drivers and cities alike.
          Our system is reliable, efficient, and built to scale as urban infrastructure grows.
        </p>
      </section>
    </div>
  );
};

export default About;
