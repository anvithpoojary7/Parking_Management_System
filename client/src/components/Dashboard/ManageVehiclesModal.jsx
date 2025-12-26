// src/components/Dashboard/ManageVehiclesModal.js
import React, { useState, useEffect } from 'react';
import './ManageVehiclesModal.css'; // Make sure you have appropriate CSS for the modal and forms

const ManageVehiclesModal = ({ isOpen, onClose, vehicles, onAddVehicle, onEditVehicle, onDeleteVehicle }) => {
  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null); // Null for add, object for edit
  const [regNumber, setRegNumber] = useState(''); // Input state for registration number (maps to license_plate)
  const [type, setType] = useState('Sedan'); // Input state for vehicle type (maps to vehicle_type)
  const [color, setColor] = useState(''); // Input state for color

  // Effect to reset form state when the modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsAddEditFormOpen(false);
      setEditingVehicle(null);
      setRegNumber('');
      setType('Sedan');
      setColor('');
    }
  }, [isOpen]);

  const openAddForm = () => {
    setEditingVehicle(null); // Clear editing state for add operation
    setRegNumber('');
    setType('Sedan'); // Default type for new vehicle
    setColor('');
    setIsAddEditFormOpen(true); // Open the add/edit form
  };

  const openEditForm = (vehicle) => {
    setEditingVehicle(vehicle); // Set vehicle to be edited
    // Populate form fields with data from the vehicle object, using correct property names from backend
    setRegNumber(vehicle.license_plate); // Use license_plate from backend response
    setType(vehicle.vehicle_type);       // Use vehicle_type from backend response
    setColor(vehicle.color);
    setIsAddEditFormOpen(true); // Open the add/edit form
  };

  const closeAddEditForm = () => {
    setIsAddEditFormOpen(false);
    // Also reset form fields when closing the add/edit form view, even if modal stays open
    setEditingVehicle(null);
    setRegNumber('');
    setType('Sedan');
    setColor('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // IMPORTANT: Prevent default form submission behavior

    if (!regNumber || !type || !color) {
      alert('Please fill all fields');
      return;
    }

    // Data to send to backend (still using camelCase for internal React state and API consistency)
    const vehicleData = { regNumber, type, color };

    try {
      if (editingVehicle) {
        // If editing, call onEditVehicle with the vehicle's ID (vehicle_id from backend) and updated data
        await onEditVehicle(editingVehicle.vehicle_id, vehicleData); // Use vehicle.vehicle_id
      } else {
        // If adding, call onAddVehicle with the new vehicle data
        await onAddVehicle(vehicleData);
      }
      closeAddEditForm(); // Close the form after successful submission
    } catch (error) {
      // The onAddVehicle/onEditVehicle functions in BookSlot.js already handle alerts for errors
      console.error("Error submitting vehicle form:", error);
      // If you want the form to stay open on backend error, you would NOT call closeAddEditForm() here
      // For now, it will close, and the alert from BookSlot.js will show.
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content manage-vehicles-modal">
        <div className="modal-header">
          <h2 className="modal-title">{isAddEditFormOpen ? (editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle') : 'Manage Vehicles'}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {!isAddEditFormOpen ? ( // Display list of vehicles if not in add/edit form view
          <>
            <div className="modal-body">
              <h3 className="section-heading">Your Vehicles</h3>
              <div className="vehicle-list-modal">
                {vehicles.length === 0 ? (
                  <p className="no-vehicles-message">You have no vehicles added. Click "Add New Vehicle" to get started.</p>
                ) : (
                  vehicles.map((vehicle) => (
                    <div key={vehicle.vehicle_id} className="vehicle-item-modal"> {/* Use vehicle.vehicle_id for key */}
                      <span className="car-icon-modal">🚗</span>
                      <div className="vehicle-details-modal">
                        <h4>{vehicle.license_plate}</h4> {/* Use license_plate for display */}
                        <p>{vehicle.vehicle_type} • {vehicle.color}</p> {/* Use vehicle_type for display */}
                      </div>
                      <div className="vehicle-actions-modal">
                        <button className="edit-button" onClick={() => openEditForm(vehicle)}>
                          ✏️
                        </button>
                        <button className="delete-button" onClick={() => onDeleteVehicle(vehicle.vehicle_id)}> {/* Pass vehicle.vehicle_id */}
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="add-new-vehicle-button" onClick={openAddForm}>
                + Add New Vehicle
              </button>
              <button className="close-modal-button" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : ( // Display add/edit form view
          <div className="add-edit-vehicle-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Registration Number (License Plate)</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g., KA-20-AB-1234"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Black"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={closeAddEditForm}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehiclesModal;