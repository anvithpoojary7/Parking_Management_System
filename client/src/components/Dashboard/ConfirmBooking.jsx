import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ConfirmBooking.css";

const ConfirmBooking = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [duration, setDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  
  const { selectedSlot, selectedVehicle, date, startTime, endTime } = location.state || {};


  useEffect(() => {
    
    if (!selectedSlot || !selectedVehicle || !date || !startTime || !endTime) {
      console.log("Redirecting because booking data is missing...");
      navigate("/dashboard/bookslot");
    }
  }, [selectedSlot, selectedVehicle, date, startTime, endTime, navigate]);


  
  useEffect(() => {
    
    if (selectedSlot && date && startTime && endTime) {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);
      let diff = (end - start) / (1000 * 60 * 60);

      if (diff < 0) diff += 24;

      const calculatedDuration = parseFloat(diff.toFixed(1));
      const calculatedPrice = calculatedDuration * (selectedSlot.rate_per_hour || 0);

      setDuration(calculatedDuration);
      setTotalPrice(calculatedPrice);
    }
  }, [selectedSlot, date, startTime, endTime]);


 
  if (!selectedSlot || !selectedVehicle) {
   
    return null;
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleFinalBooking = async() => {
       const token = localStorage.getItem("token");
      // 1. Create full Date objects to compare them accurately
        let startDate = new Date(`${date}T${startTime}`);
        let endDate = new Date(`${date}T${endTime}`);

        // 2. Check if the end time is on the next day
        if (endDate <= startDate) {
            // If the end time is before or same as start, it's an overnight booking.
            // Add one day to the end date.
            endDate.setDate(endDate.getDate() + 1);
        }

        // 3. Format dates to ISO string, which is a standard and safe format for databases
        const finalStartTime = startDate.toISOString();
        const finalEndTime = endDate.toISOString();

    if (!token) {
      alert("You are not logged in. Please log in to book a slot.");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 2. Send the token in the Authorization header
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          // The backend will get user_id from the token
          slot_id: selectedSlot.slot_id,
          vehicle_id: selectedVehicle.id, // Make sure you're using the correct vehicle ID property
          start_time: finalStartTime,
          end_time: finalEndTime,
          booking_duration_hours: duration,
          total_cost: totalPrice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        
        navigate("/dashboard/booking-success", {
          state: {
            slot: selectedSlot,
            vehicle: selectedVehicle,
            date,
            startTime,
            endTime,
            duration,
            totalPrice,
            bookingId: data.booking.booking_id, 
          },
        });
      } else {
        
        alert(data.message || "Booking failed. The slot might have just been taken.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while communicating with the server.");
    }
     
  };

  // 6. The JSX can now safely assume all data exists.
  return (
    <div className="summary-container">
      <div className="summary-card">
        <h2>Booking Summary</h2>
        <p>Review your booking details</p>
        <hr />
        <div className="summary-section">
          <h3>Parking Details</h3>
          <p>
            <strong>Location:</strong> {selectedSlot.location_name || "Airport Terminal"}
          </p>
          <p>
            <strong>Slot:</strong> {`${selectedSlot.sublocation_name} - ${selectedSlot.slot_id}`}
          </p>
          <p>
            <strong>Type:</strong> {selectedVehicle.type}
          </p>
        </div>
        <hr />
        <div className="summary-section">
          <h3>Duration</h3>
          <p>
            <strong>Date:</strong> {formatDate(date)}
          </p>
          <p>
            <strong>Time:</strong> {`${startTime} - ${endTime}`}
          </p>
          <p>
            <strong>Duration:</strong> {duration.toFixed(1)} hours
          </p>
        </div>
        <hr />
        <div className="summary-section">
          <h3>Vehicle</h3>
          <p>
            <strong>Number:</strong> {selectedVehicle.number}
          </p>
          <p>
            <strong>Type:</strong> {selectedVehicle.type}
          </p>
          <p>
            <strong>Model:</strong> {selectedVehicle.model}
          </p>
        </div>
        <hr />
        <div className="price-details">
          <span>
            ₹{selectedSlot.rate_per_hour || 0}/hr × {duration.toFixed(1)} hrs
          </span>
          <span className="total-price">₹{totalPrice.toFixed(2)}</span>
        </div>
        <button className="book-now-btn" onClick={handleFinalBooking}>
          Book Now - ₹{totalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;