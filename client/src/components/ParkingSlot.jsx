import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const parkingData = {
       Udupi: [
    { sublocation: 'Near Shri Krishna Temple', price: 50, lat: 13.34120966036416,  lng: 74.75203522300575 },
    { sublocation: 'Times Square Mall', price: 40, lat: 13.34584467535864, lng:   74.75280756992879 },
    { sublocation: 'Bus Stand', price: 30, lat: 13.342221245313944, lng:  74.74683652083469},
  ],
  Mangalore: [
    { sublocation: 'City Center', price: 60, lat: 12.9171, lng: 74.8560 },
    { sublocation: 'Beach Road', price: 55, lat: 12.9123, lng: 74.8425 },
    { sublocation: 'Railway Station', price: 45, lat: 12.8733, lng: 74.8420 },
  ],
  Brahmavar: [
    { sublocation: 'Barkur', price: 70, lat: 13.4590, lng: 74.7369, },
    { sublocation: 'Bus Stand', price: 35, lat: 13.436747066079194, lng: 74.74435386260419 },
    { sublocation: 'Barkurpete', price: 50, lat: 13.467229989416275, lng: 74.74871007853994},
    {sublocation: 'City Center',price: 90 ,lat:13.43260573807967 ,lan:74.74356354114119 },
  ],

};

const cityCenters = {
  Udupi: { lat: 13.3392, lng: 74.7421 },
  Mangalore: { lat: 12.9141, lng: 74.8560 },
  Brahmavar: { lat: 13.4293, lng: 74.7370 },
};

export default function ParkingSlots() {
  const location = useLocation();
  const navigate = useNavigate();

  const city = location.state?.city;

  if (!city) {
    navigate('/viewlocation');
    return null;
  }

  const slots = parkingData[city] || [];

  const handleBookSlot = (sublocation) => {
    alert(`Booking slot at ${sublocation} in ${city}`);
    // TODO: Add booking logic here
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Parking Slots in {city}</h1>

      {/* Map Section */}
      <div style={{ width: '100%', height: '400px', marginBottom: '30px' }}>
        <LoadScript googleMapsApiKey="AIzaSyD_OyfosQ0_NUo-QIO-pMovrEjspnP0Qcw">
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '100%',
              borderRadius: '12px',
            }}
            center={cityCenters[city]}
            zoom={14}
          >
            {slots.map(({ sublocation, lat, lng }) => (
              <Marker
                key={sublocation}
                position={{ lat, lng }}
                title={sublocation}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Slot Cards */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {slots.map(({ sublocation, price }) => (
          <div
            key={sublocation}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '250px',
              boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3>{sublocation}</h3>
            <p>Price: ₹{price}</p>
            <button onClick={() => handleBookSlot(sublocation)}>
              Book Slot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
