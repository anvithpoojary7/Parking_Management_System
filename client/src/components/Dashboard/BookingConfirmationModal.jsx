// BookingConfirmationModal.js
import React from 'react';
import './BookingConfirmationModal.css'; 
const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails, onPayAndConfirm }) => {
  if (!isOpen) return null;

  // Destructure details for easier use in JSX
  const { location, date, time, duration, selectedVehicle, selectedSlot } = bookingDetails;

  // Placeholder for dynamic calculation (you'll implement real logic)
  const parkingFee = selectedSlot ? selectedSlot.totalRate : 0;
  const platformFee = 5; // Example fixed fee
  const gstPercentage = 0.18; // 18%
  const gst = Math.round((parkingFee + platformFee) * gstPercentage); // Calculate GST
  const totalAmount = parkingFee + platformFee + gst;

  return (
    <div className="modal-overlay">
      <div className="modal-content booking-confirmation-modal">
        <div className="modal-header">
          <h2 className="modal-title">Booking Confirmation</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Booking Summary Section */}
        <div className="modal-section booking-summary-modal">
          <h3 className="section-heading">Booking Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>{location}</p>
              </div>
            </div>
            <div className="summary-item vehicle-summary">
              <span className="summary-icon">🚗</span>
              <div>
                <strong>Vehicle</strong>
                <p>{selectedVehicle?.regNumber}</p>
                <p className="sub-detail">{selectedVehicle?.type} • {selectedVehicle?.color}</p>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🗓️</span>
              <div>
                <strong>Date</strong>
                <p>{date ? new Date(date).toDateString() : 'N/A'}</p> {/* Format date */}
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">⏰</span>
              <div>
                <strong>Time</strong>
                <p>{time} - {
                  // Calculate end time
                  time && duration ?
                  (() => {
                    const [hours, minutes] = time.split(':').map(Number);
                    const endTimeHours = hours + parseInt(duration);
                    const endTimeMinutes = minutes;
                    return `${String(endTimeHours).padStart(2, '0')}:${String(endTimeMinutes).padStart(2, '0')}`;
                  })()
                  : 'N/A'
                }</p>
                <p className="sub-detail">{duration} hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Parking Slot Details Section */}
        <div className="modal-section parking-slot-details-modal">
          <h3 className="section-heading">Parking Slot Details</h3>
          <div className="slot-details-content">
            <p className="slot-name-details">{selectedSlot?.name}</p>
            <div className="slot-features-details">
              {selectedSlot?.features.map((feature, index) => (
                <span key={index} className="slot-feature-tag-modal">
                  {feature.icon && <span className="feature-icon">{feature.icon}</span>}
                  {feature.text}
                </span>
              ))}
            </div>
            <div className="slot-rate-details">
              <span className="rate-label">Rate: ₹{selectedSlot?.hourlyRate}/hour</span>
              <span className="total-cost-details">₹{selectedSlot?.totalRate}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="modal-section payment-method-modal">
          <h3 className="section-heading">Payment Method</h3>
          <div className="payment-options">
            <label className="radio-option">
              <input type="radio" name="paymentMethod" value="creditDebit" defaultChecked />
              Credit/Debit Card
            </label>
            <label className="radio-option">
              <input type="radio" name="paymentMethod" value="digitalWallet" />
              Digital Wallet
            </label>
          </div>
        </div>

        {/* Cost Breakdown Section */}
        <div className="modal-section cost-breakdown-modal">
          <h3 className="section-heading">Cost Breakdown</h3>
          <div className="breakdown-item">
            <span>Parking Fee ({duration} hours)</span>
            <span>₹{parkingFee}</span>
          </div>
          <div className="breakdown-item">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="breakdown-item">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="total-amount-row">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="pay-confirm-button" onClick={() => onPayAndConfirm(totalAmount)}>
            Pay & Confirm Booking
          </button>
        </div>
        <p className="terms-conditions">
          By confirming this booking, you agree to our terms and conditions. Cancellation policy applies as per our guidelines.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;