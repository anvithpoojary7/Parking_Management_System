import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardNavbar.css"; // Style it separately

const DashboardNavbar = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-navbar">
      <div className="left">
        <h2>ParkSmart</h2>
      </div>
      <div className="right">
        <span className="user-name">Hi, {user.name || "User"}</span>
        {user.picture && <img src={user.picture} alt="Profile" className="profile-pic" onClick={() => setDropdownOpen(!dropdownOpen)} />}
        {!user.picture && <button onClick={() => setDropdownOpen(!dropdownOpen)}>☰</button>}
        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={() => navigate("/settings")}>Settings</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;
