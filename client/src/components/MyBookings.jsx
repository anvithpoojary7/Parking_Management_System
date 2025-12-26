import React, { useState } from 'react';
import './MyBookings.css';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('ongoing');

  const ongoingBookings = [
    {
      id: 1,
      location: 'Udupi Bus Stand',
      checkIn: '10:30 AM',
      checkOut: '12:00 PM',
      date: '12 June 2025',
      duration: '1h 30m',
      amount: '₹40'
    },
    {
      id: 2,
      location: 'Brahmavara Market',
      checkIn: '4:15 PM',
      checkOut: 'Ongoing',
      date: '12 June 2025',
      duration: '1h 10m',
      amount: '₹35 (running)'
    }
  ];

  const pastBookings = [
    {
      id: 3,
      location: 'Manipal Parking Hub',
      checkIn: '8:00 AM',
      checkOut: '9:30 AM',
      date: '11 June 2025',
      duration: '1h 30m',
      amount: '₹50'
    }
  ];

  const bookingsToShow = activeTab === 'ongoing' ? ongoingBookings : pastBookings;

  return (
    <div className="my-bookings mt-6">
      <h2 className="text-2xl font-bold mb-4">My Parking Bookings</h2>

      <div className="tabs mb-4">
        <button
          className={`tab-button ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      {bookingsToShow.map((booking, index) => (
        <div key={booking.id} className={`booking-card ${index === 0 ? 'highlight' : ''}`}>
          <div className="booking-info">
            <div className="booking-image" />
            <div>
              <h3 className="font-semibold text-lg">{booking.location}</h3>
              <p>📍 <strong>Check In:</strong> {booking.checkIn} — <strong>Check Out:</strong> {booking.checkOut}</p>
              <p>📅 <strong>Date:</strong> {booking.date} 🕒 <strong>Duration:</strong> {booking.duration}</p>
              <p>💰 <strong>Amount Paid:</strong> {booking.amount}</p>
              {activeTab === 'ongoing' && (
                <span className="status-badge">Ongoing</span>
              )}
            </div>
          </div>
          {activeTab === 'ongoing' && (
            <button className="end-button">End Parking</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
