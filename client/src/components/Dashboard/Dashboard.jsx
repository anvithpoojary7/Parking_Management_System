import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from '../Footer';
import NavBar from '../NavBar';
import { Outlet } from 'react-router-dom';
import '../Dashboard/Dashboard.css';

const Dashboard = () => {
  return (
    <>
     
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <Topbar />
          <div className="dashboard-content">
            <Outlet />
          </div>
         
        </div>
      </div>
    </>
  );
};

export default Dashboard;
