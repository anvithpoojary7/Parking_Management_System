import React from 'react'
import './nav.css'
import { Link } from 'react-router-dom';
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar =()=>{
    const navigate=useNavigate();
     return(
        <nav className="navbar">
            <div className="navbar-container">
             <h1 className="logo">ParkSmart</h1>
             <ul className="nav-links">
                <li><Link to="/About" >About us</Link></li>
                <li><Link to="/Home">Home </Link></li>
                <li><Link href="#">Contact</Link></li>
                <li>
                <button onClick={()=> navigate("/login")} className='login-button '>
                  Login
                 
                </button>
                </li>
             </ul>
             </div>
        </nav>
     );
};

export default NavBar;