import React from 'react';
import './DashboardWelcome.css';

const DashboardWelcome = () => {
  return (
    <div className="dashboard-welcome">
      <h2>Today’s Summary</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Active Parking</h3>
          <p>Slot A3 - Manipal</p>
        </div>
        <div className="card">
          <h3>Total Bookings</h3>
          <p>18 this month</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
