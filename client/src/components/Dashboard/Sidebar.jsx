import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTh, FaBell, FaCog, FaSignOutAlt, FaCreditCard, FaExchangeAlt, FaBook
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="custom-sidebar">
      <div className="logo-section" style={{ padding: '16px' }}>
        <div className="logo-icon">🅿️</div>
        <h2 className="logo-text">PARKSMART</h2>
      </div>

      {/* Scrollable nav area */}
      <div className="sidebar-scroll-area">
        <ul className="nav-section">
          <li className="nav-item"><Link to="/dashboard"><FaTh className="icon" /> Dashboard</Link></li>
          <li className="nav-item"><Link to="/dashboard/bookslot"><FaBook className="icon" /> BookSlot</Link></li>
          <li className="nav-item"><Link to="/dashboard/notifications"><FaBell className="icon" /> Notifications</Link></li>
          <li className="nav-item"><Link to="/settings"><FaCog className="icon" /> Settings</Link></li>
        </ul>

        <hr className="divider" />

        <div className="report-section-title">Report</div>
        <ul className="nav-section">
          <li className="nav-item"><Link to="/payments"><FaCreditCard className="icon" /> Payment Details</Link></li>
          <li className="nav-item"><Link to="/transactions"><FaExchangeAlt className="icon" /> Transactions</Link></li>
        </ul>
      </div>

    
      <div className="sidebar-footer">
        <button className="logout-btn"><FaSignOutAlt className="icon" /> Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
