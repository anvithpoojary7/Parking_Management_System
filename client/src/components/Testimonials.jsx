import React from "react";
import './Testimonials.css'

const testimonials = [
  {
    quote: 'ParkSmart saved me so much time! I never stress about parking anymore',
    name: 'Ravi Shetty',
    title: 'Frequent commuter, Bengaluru',
    image: '../assets/ravi.jpg'
  },
  {
    quote: 'Finally, a smart way to find parking without circling for hours',
    name: 'Ananya Rao',
    title: 'Tech employee, Hyderabad',
    image: '../assets/ananaya.jpg'
  },
  {
    quote: 'Reliable and super easy to use. ParkSmart is a must for city driving',
    name: 'Aman Gupta',
    title: 'Startup founder, Mumbai',
    image: '../assets/aman.jpg'
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonial-cards">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <p className="quote">{t.quote}</p>
            <div className="author">
              <img src={t.image} alt={t.name} className="avatar" />
              <div>
                <strong>{t.name}</strong>
                <p>{t.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;