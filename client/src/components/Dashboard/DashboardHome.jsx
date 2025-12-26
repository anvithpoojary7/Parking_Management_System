// DashboardHome.jsx
import React from 'react';
import DashboardWelcome from './DashboardWelcome';

import ActiveBookingStatus from './ActiveBookingStatus';
import BookingHistoryChart from './BookingHistoryChart';
import VehicleStatsPie from './VehicleStatsPie';

const DashboardHome = () => {
  return (
    <>
      <DashboardWelcome />
     
      <ActiveBookingStatus />
      <div className="dashboard-analytics">
        <BookingHistoryChart />
        <VehicleStatsPie />
      </div>
    </>
  );
};

export default DashboardHome;
