import React, { useState, useEffect } from "react";
import "./BookSlot.css";
import { io } from "socket.io-client";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaTruck,
  FaMotorcycle,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const getCurrentTimeString = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};


const getOneHourLaterString = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

const BookSlot = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Airport Parking");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
 
  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState(getCurrentTimeString());
  const [endTime, setEndTime] = useState(getOneHourLaterString());

  const [duration, setDuration] = useState(0);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(''); 

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState({ 
  isChecking: false, 
  isParked: false, 
  message: '' 
});
  const handleSelectVehicle=async(vehicle)=>{
      if (selectedVehicle?.id === vehicle.id) {
    setSelectedVehicle(null);
    setVehicleStatus({ isChecking: false, isParked: false, message: '' });
    return;
  }

  setSelectedVehicle(vehicle);
  setVehicleStatus({ isChecking: true, isParked: false, message: 'Checking status...' });
   try{
      const token=localStorage.getItem('token');
      const res=await fetch(`${BACKEND_URL}/api/vehicles/${vehicle.id}/status`,{
         headers:{Authorization:`Bearer ${token}`},
      });
      if(!res.ok) throw new Error("failed to check vehicle status");

      const data=await res.json();
      setVehicleStatus({isChecking:false,isParked:data.isParked,message:data.message});

   }catch(err){
       console.error("Error checking vehicle status:", err);
    setVehicleStatus({ 
      isChecking: false, 
      isParked: true,
      message: 'Could not verify vehicle status.' 
    });
   }
  }
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login'); 
          return;
        }
        const res = await fetch(`${BACKEND_URL}/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        setVehicles(
          data.map((v) => ({
            id: v.vehicle_id,
            number: v.license_plate,
            type: v.vehicle_type,
            model: v.model,
            color: v.color,
          }))
        );
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, [navigate]);


  useEffect(() => {
    const calculateDuration = () => {
        if (!date || !startTime || !endTime) {
            setDuration(0);
            return;
        }
        const start = new Date(`${date}T${startTime}`);
        let end = new Date(`${date}T${endTime}`);

        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        const diff = (end - start) / (1000 * 60 * 60);
        setDuration(diff.toFixed(1));
    };
    calculateDuration();
  }, [date, startTime, endTime]);

 useEffect(()=>{
      const socket=io(BACKEND_URL);
      
      socket.on("slotBooked",(data)=>{
           console.log("slot booked update",data);

           setAvailableSlots((prev)=>

               prev.map((slot)=>{

                 if(slot.slot_id === data.slot_id){
                   return { ...slot,status:"Booked"};

                 } 
                 return slot;
               })
           );
      });

      return ()=>{
          socket.disconnect();
      }



 },[]);

  const handleSearch = async () => {
    setError('');
    setShowSlots(false);

    const startDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    if (startDateTime < now) {
        setError("You cannot search for parking slots in the past. Please select a future time.");
        return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/searchslots/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          startTime: `${date}T${startTime}`,
          endTime: `${date}T${endTime}`,
          vehicleType: selectedVehicle?.type || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setAvailableSlots(data);
      setShowSlots(true);
      setSelectedSlot(null);
    } catch (err) {
      console.log(err);
      setError("Error fetching the slots. Please check your criteria and try again.");
    }
  };

  const handleSelectSlot = (clickedSlot) => {
    if(clickedSlot.status === "Booked"){ 
       alert("the slot is already booked");
      return;
    }

    if (selectedSlot && selectedSlot.slot_id === clickedSlot.slot_id) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(clickedSlot);
    }
  };


  const handleAddVehicle = async () => {
    const vehicle = {
      license_plate: document.getElementById("vnum").value,
      vehicle_type: document.getElementById("vtype").value,
      model: document.getElementById("vmodel").value,
      color: document.getElementById("vcolor").value,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicle),
      });

      if (res.status === 409) {
        alert("This license plate is already registered to your account.");
        return;
      }
      if (!res.ok) throw new Error("Failed to add vehicle");

      const newVehicle = await res.json();
      setVehicles([
        ...vehicles,
        {
          id: newVehicle.vehicle_id,
          number: newVehicle.license_plate,
          type: newVehicle.vehicle_type,
          model: newVehicle.model,
          color: newVehicle.color,
        },
      ]);
      setShowVehicleModal(false);
    } catch (err) {
      console.error("Error adding vehicle:", err);
      alert("Failed to add vehicle");
    }
  };

  // ---------- Icons ----------
  const vehicleIcon = (type) => {
    switch (type) {
      case "4-wheeler": return <FaCar />;
      case "2-wheeler": return <FaMotorcycle />;
      case "EV": return <FaBolt />;
      case "heavy-vehicle": return <FaTruck />;
      default: return <FaCar />;
    }
  };

  return (
    <div className="bookslot-container">
      <div className="search-card">
        <h2><FaMapMarkerAlt /> Find Parking</h2>
        <p>Search for available parking slots based on your preferences</p>
        <div className="form-row">
          <div className="form-group">
            <label>Parking Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option>Airport Parking</option>
              <option>City Center Parking</option>
              <option>Mall Parking</option>
              <option>Tech Park Parking</option>
              <option>Railway Station Parking</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <div className="input-icon">
              <FaCalendarAlt />
              <input type="date" value={date} min={getTodayString()} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Time</label>
            <div className="input-icon">
              <FaClock />
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>End Time</label>
            <div className="input-icon">
              <FaClock />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input type="text" value={`${duration} hours`} readOnly />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        <button className="search-btn" onClick={handleSearch}>
          Search Available Slots
        </button>
      </div>

      {showSlots && (
         <div className="slots-section">
            <h3>Available Slots</h3>
            {availableSlots.length > 0 ? (
                <>
                <p>{availableSlots.length} slots found</p>
                <div className="slots-grid">
                    {availableSlots.map((slot) => (
                    <div
                        key={slot.slot_id}
                        className={`slot-card ${selectedSlot?.slot_id === slot.slot_id ? "selected" : ""}`}
                        onClick={() => handleSelectSlot(slot)}
                    >
                        <div className="slot-header">
                        {vehicleIcon(slot.vehicle_type)}
                        <span>{slot.sublocation_name}</span>
                        </div>
                        <div className="slot-price">₹{slot.rate_per_hour}/hr</div>
                        <p>Slot {slot.slot_id}</p>
                        <span className="slot-type">{slot.slot_type}</span>
<span
  className={`slot-status ${
    slot.status === "Booked" ? "booked" : "available"
  }`}
>
  {slot.status ||"Available"}
</span>
                    </div>
                    ))}
                </div>
                </>
            ) : (
                <p>No slots available for the selected criteria.</p>
            )}
        </div>
      )}

      {selectedSlot && (
        <div className="vehicle-section">
          <h3>Select Vehicle</h3>
          {loadingVehicles ? (<p>Loading your vehicles...</p>) : (
            <>
              <p>Choose a vehicle for this booking or add a new one</p>
              <div className="vehicle-grid">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className={`vehicle-card ${selectedVehicle?.id === v.id ? "selected" : ""}`}
                    onClick={() => handleSelectVehicle(v)}
                  >
                    <div className="vehicle-header">
                      {vehicleIcon(v.type)} <strong>{v.number}</strong>
                    </div>
                    <p>{v.model} • {v.color}</p>
                    <span className="vehicle-type">{v.type}</span>
                  
               {selectedVehicle?.id === v.id && vehicleStatus.message && (
      <span className={`vehicle-status ${vehicleStatus.isParked ? 'error' : 'success'}`}>
        {vehicleStatus.message}
      </span>
    )};
    </div>
                ))}
               
              </div>
              <button className="add-vehicle-btn" onClick={() => setShowVehicleModal(true)}>
                + Add New Vehicle
              </button>
            </>
          )}
        </div>
      )}

     {selectedSlot && selectedVehicle && (
  <div className="confirm-section">
    <button
      className="booknow-btn"
      onClick={() => {
        navigate('/dashboard/confirmreservation', {
          state: { selectedSlot, selectedVehicle, date, startTime, endTime }
        });
      }}
      // Disable the button if checking or if the vehicle is parked
      disabled={vehicleStatus.isChecking || vehicleStatus.isParked}
    >
      {/* Show a different text while checking */}
      {vehicleStatus.isChecking ? 'Verifying Vehicle...' : 'Book Now'}
    </button>
  </div>
)}

      {showVehicleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Vehicle</h3>
            <p>Add a new vehicle to your account for future bookings</p>
            <input type="text" placeholder="e.g., KA 01 AB 1234" id="vnum" />
            <select id="vtype">
              <option>4-wheeler</option>
              <option>2-wheeler</option>
              <option>EV</option>
              <option>heavy-vehicle</option>
            </select>
            <div className="form-row">
              <input type="text" placeholder="e.g., Honda City" id="vmodel" />
              <input type="text" placeholder="e.g., White" id="vcolor" />
            </div>
            <button className="search-btn" onClick={handleAddVehicle}>
              Add Vehicle
            </button>
            <button className="close-btn" onClick={() => setShowVehicleModal(false)}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSlot;

