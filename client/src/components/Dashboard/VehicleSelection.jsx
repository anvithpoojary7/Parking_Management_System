// src/components/Dashboard/VehicleSelection.js
import React, { useState } from 'react';
import './VehicleSelection.css';
import ManageVehiclesModal from './ManageVehiclesModal';

const VehicleSelection = ({ vehicles, selectedVehicle, onSelectVehicle, onAddVehicle, onEditVehicle, onDeleteVehicle }) => {
  const [isManageVehiclesModalOpen, setIsManageVehiclesModalOpen] = useState(false);

  const handleVehicleClick = (vehicle) => {
    // Inform the parent component (BookSlot) about the selected vehicle
    onSelectVehicle(vehicle);
  };

  const openManageVehiclesModal = () => {
    setIsManageVehiclesModalOpen(true);
  };

  const closeManageVehiclesModal = () => {
    setIsManageVehiclesModalOpen(false);
  };

  return (
    <div className="vehicle-selection-container">
      <h3 className="vehicle-selection-heading">Vehicle Selection</h3>
      <div className="vehicle-list">
        {vehicles.length === 0 ? (
            <p className="no-vehicles-message">No vehicles added yet. Click "Manage Vehicles" to add one.</p>
        ) : (
            vehicles.map((vehicle) => (
                <div
                    key={vehicle.vehicle_id} // Use 'vehicle_id' from PostgreSQL as the key
                    className={`vehicle-card ${selectedVehicle && selectedVehicle.vehicle_id === vehicle.vehicle_id ? 'selected' : ''}`}
                    onClick={() => handleVehicleClick(vehicle)}
                >
                    <div className="vehicle-details">
                        {/* CHANGE: Use 'license_plate' for registration number display */}
                        <h4>{vehicle.license_plate}</h4>
                        {/* CHANGE: Use 'vehicle_type' for type display */}
                        <p>{vehicle.vehicle_type} • {vehicle.color}</p>
                    </div>
                    <span className="car-icon">🚗</span>
                </div>
            ))
        )}
      </div>
      <button className="manage-vehicles-button" onClick={openManageVehiclesModal}>
        Manage Vehicles
      </button>

      {/* The Manage Vehicles Modal */}
      <ManageVehiclesModal
        isOpen={isManageVehiclesModalOpen}
        onClose={closeManageVehiclesModal}
        vehicles={vehicles} // Pass current vehicles to the modal
        // Pass the actual CRUD functions down to the modal
        onAddVehicle={onAddVehicle}
        onEditVehicle={onEditVehicle}
        onDeleteVehicle={onDeleteVehicle}
      />
    </div>
  );
};

export default VehicleSelection;