import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSucess.css"; // optional

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    // If no state passed, go back to dashboard
    navigate("/dashboard");
    return null;
  }

  const { slot, vehicle, date, startTime, endTime, duration, totalPrice } = location.state;

  return (
    <div className="success-container">
      <div className="success-card">
        <h2>🎉 Booking Confirmed!</h2>
        <p>Your slot has been successfully booked.</p>

        <hr />

        <div className="success-section">
          <h3>Booking Details</h3>
          <p><strong>Location:</strong> {slot.location_name || "Airport Terminal"}</p>
          <p><strong>Slot:</strong> {`${slot.sublocation_name} - ${slot.slot_id}`}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {startTime} - {endTime}</p>
          <p><strong>Duration:</strong> {duration.toFixed(1)} hrs</p>
        </div>

        <hr />

        <div className="success-section">
          <h3>Vehicle</h3>
          <p><strong>Number:</strong> {vehicle.number}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>
          <p><strong>Model:</strong> {vehicle.model}</p>
        </div>

        <hr />

        <div className="price-summary">
          <h3>Total Paid: ₹{totalPrice.toFixed(2)}</h3>
        </div>

        <button className="go-dashboard-btn" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
