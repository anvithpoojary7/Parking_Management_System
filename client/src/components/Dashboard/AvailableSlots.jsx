import React, { useState } from 'react';
import './AvailableSlots.css';
import SlotFilterPanel from './SlotFilterPanel'; // Import the filter panel

const AvailableSlots = ({ slots, selectedSlot, onSelectSlot }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSelectSlot = (slot) => {
    onSelectSlot(slot);
    console.log("Slot selected internally:", slot.id);
  };

  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };

  const handleApplyFilters = () => {
    // You can implement API call/filter logic here later
    console.log("Filters applied.");
  };

  return (
    <div className="available-slots-container">
      <div className="available-slots-header">
        <h2 className="available-slots-heading">Available Parking Slots</h2>
        <button className="filter-button" onClick={toggleFilterPanel}>
          <span className="filter-icon">⚙️</span> Filter
        </button>
      </div>

      {showFilters && (
        <div className="filter-dropdown-panel">
          <SlotFilterPanel onApply={handleApplyFilters} />
        </div>
      )}

      <div className="slots-grid">
        {slots.length === 0 ? (
          <p>No slots to display. Please adjust your search criteria.</p>
        ) : (
          slots.map((slot) => (
            <div
              key={slot.id}
              className={`slot-card ${selectedSlot && selectedSlot.id === slot.id ? 'selected-slot-card' : ''}`}
            >
              <div className="slot-header">
                <h3 className="slot-name">{slot.name}</h3>
                <span className={`slot-availability ${slot.available ? 'available' : 'unavailable'}`}>
                  {slot.available ? 'Available' : 'Unavailable'}
                </span>
                <span className="slot-rating">⭐ {slot.rating}</span>
              </div>

              <div className="slot-features">
                {slot.features.map((feature, index) => (
                  <span key={index} className="slot-feature-tag">
                    {feature.icon && <span className="feature-icon">{feature.icon}</span>}
                    {feature.text}
                  </span>
                ))}
              </div>

              <div className="slot-distance">
                <span className="location-icon">📍</span> {slot.distance} km away
              </div>

              <div className="slot-rates">
                <p className="hourly-rate">Hourly Rate <span className="rate-value">₹{slot.hourlyRate}/hr</span></p>
                <p className="total-rate">Total ({slot.duration}h) <span className="rate-value">₹{slot.totalRate}</span></p>
              </div>

              <button
                className={`select-slot-button ${selectedSlot && selectedSlot.id === slot.id ? 'button-selected' : ''}`}
                onClick={() => handleSelectSlot(slot)}
                disabled={!slot.available || (selectedSlot && selectedSlot.id === slot.id)}
              >
                {selectedSlot && selectedSlot.id === slot.id ? 'Selected' : 'Select Slot'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableSlots;
