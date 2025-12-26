import React from "react";
import './Footer.css';
import { Link } from "react-router-dom";
const Footer = () => {
   return (
      <footer className="footer">
         <div className="footer-brand">
            <h2>ParkSmart</h2>
            <div className="footer-socials">
               <a href="#"><i className="fab fa-facebook-f"></i></a>
               <a href="#"><i className="fab fa-linkedin-in"></i></a>
               <a href="#"><i className="fab fa-youtube"></i></a>
               <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
         </div>

         <div className="footer-links">
            <div className="footer-column">
               <h4>Company</h4>
               <Link to="/About" >About us</Link>
               <a href="#">Careers</a>
               <a href="#">Blogs</a>
            </div>
         
         <div className="footer-column">
            <h4>Services</h4>
            <a href="#">How it works</a>
            <a href="#">Pricing</a>
            <a href="#">Book a spot</a>
         </div>

         <div className="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">FAQs</a>
            <a href="#">Contact Us</a>
         </div>
        </div>

      </footer >
   );
}

export default Footer;