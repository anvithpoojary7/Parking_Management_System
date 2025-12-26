// src/components/Dashboard/UserProfileDropdown.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegUserCircle, FaCar, FaCog, FaSignOutAlt } from 'react-icons/fa'; 
import './UserProfileDropdown.css'; 

const UserProfileDropdown = ({ userName, onLogout, onClose }) => {
  return (
    <div className="user-profile-dropdown">
      <div className="dropdown-header">
        <span className="dropdown-username">{userName || 'User'}</span>
      </div>
      <nav className="dropdown-nav">
        <ul>
          <li onClick={onClose}> {/* Close dropdown on click of any link */}
            <div className="dropdown-section-title">My Account</div>
          </li>
          <li onClick={onClose}>
            <NavLink to="/dashboard/profile" className="dropdown-link">
              <FaRegUserCircle className="dropdown-icon" /> Profile
            </NavLink>
          </li>
          <li onClick={onClose}>
            <NavLink to="/dashboard/my-vehicles" className="dropdown-link">
              <FaCar className="dropdown-icon" /> My Vehicles
            </NavLink>
          </li>
          <li onClick={onClose}>
            <NavLink to="/dashboard/settings" className="dropdown-link">
              <FaCog className="dropdown-icon" /> Settings
            </NavLink>
          </li>
          <li className="logout-item" onClick={onClose}>
            <button className="dropdown-link logout-button" onClick={onLogout}>
              <FaSignOutAlt className="dropdown-icon logout-icon" /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserProfileDropdown;