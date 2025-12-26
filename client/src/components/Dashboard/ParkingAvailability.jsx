import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParkingAvailability.css';

// Helper function to get today's date in the required YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Helper function to get the current time in the required HH:MM format
const getCurrentTimeString = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

const ParkingAvailability = () => {
  const [location, setLocation] = useState('Airport Terminal');
  // Initialize date and time with the current date and time
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(getCurrentTimeString());
  const [costFilter, setCostFilter] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // New state for validation errors

  const navigate = useNavigate();

  const handleCheckAvailability = async () => {
    // 1. Clear previous results and errors before each check
    setLoading(true);
    setAvailability(null);
    setError('');

    // 2. Frontend Validation: Check if the selected date and time are in the past
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    // We can give a 1-minute grace period to prevent issues with the exact second of submission
    now.setMinutes(now.getMinutes() - 1);

    if (selectedDateTime < now) {
      setError('❌ You cannot check for availability in the past. Please select a future date and time.');
      setLoading(false);
      return; // Stop the function here if validation fails
    }

    // 3. Proceed with API call if validation passes
    try {
      const response = await fetch('http://localhost:5000/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          date,
          time,
          costFilter
        })
      });

      const data = await response.json();
      setAvailability(data.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      setError('Could not connect to the server. Please try again later.');
      setAvailability(false);
    }

    setLoading(false);
  };

  return (
    <div className="parking-availability">
      <h3>Check Slot Availability</h3>

      <div className="check-form">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="date"
          value={date}
          // 4. This 'min' attribute prevents selecting past dates in the browser's date picker
          min={getTodayString()}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <select
          value={costFilter}
          onChange={(e) => setCostFilter(e.target.value)}
        >
          <option value="">Filter by Cost</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
        <button onClick={handleCheckAvailability}>Check</button>
      </div>

      {/* 5. Display validation error message to the user */}
      {error && <p className="error-message">{error}</p>}

      {loading && <p>Checking availability...</p>}

      {availability === true && (
        <div className="availability-result available">
          <p>✅ Slots Available!</p>
          <button onClick={() => navigate('/dashboard/bookings')}>
            Book Now
          </button>
        </div>
      )}

      {/* Show 'not available' message only if there's no other error */}
      {availability === false && !loading && !error && (
        <div className="availability-result not-available">
          <p>❌ No slots available for the selected time and location.</p>
        </div>
      )}
    </div>
  );
};

export default ParkingAvailability;
