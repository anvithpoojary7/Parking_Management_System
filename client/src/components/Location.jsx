import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; 
import './Location.css';

const locations = {
  Udupi: {
    lat: 13.3392,
    lng: 74.7421,
    description: 'Udupi offers peaceful beachside parking spots near tourist zones and temples.',
  },
  Mangalore: {
    lat: 12.9141,
    lng: 74.8560,
    description: 'Mangalore provides smart parking facilities near malls, markets, and city centers.',
  },
   Brahmavar: {
    lat: 13.4293,
    lng: 74.7370,
    description: 'Brahmavar has convenient parking areas near NH66, colleges, and local markets.',
  },
};

const Location = () => {
  const [selectedCity, setSelectedCity] = useState('Udupi');
  const locationRef = useRef(null);
  const navigate = useNavigate(); 

  const handleLocationClick = (city) => {
    setSelectedCity(city);
  };

 
  const handleBookNowClick = () => {
    navigate('/parkingslots', { state: { city: selectedCity } });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={locationRef}
      className="view-location-container"
      style={{ display: 'flex', padding: '20px', height: '100vh' }}
    >
      
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <h2>Pick a Location</h2>
        <p>Choose a city to view available smart parking options on the map.</p>

      
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          {Object.keys(locations).map((city) => (
            <div
              key={city}
              onClick={() => handleLocationClick(city)}
              style={{
                border: selectedCity === city ? '2px solid #007bff' : '1px solid #ccc',
                backgroundColor: selectedCity === city ? '#f0f8ff' : '#fff',
                color: selectedCity === city ? '#007bff' : '#333',
                padding: '20px',
                cursor: 'pointer',
                borderRadius: '12px',
                width: '120px',
                textAlign: 'center',
                boxShadow: selectedCity === city
                  ? '0 4px 12px rgba(0, 123, 255, 0.3)'
                  : '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: selectedCity === city ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => {
                if (selectedCity !== city) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📍</div>
              <strong>{city}</strong>
            </div>
          ))}
        </div>

    
        <div style={{ marginTop: '30px' }}>
          <h3>About {selectedCity}</h3>
          <p style={{ fontSize: '15px', color: '#555', marginTop: '10px' }}>
            {locations[selectedCity].description}
          </p>
        </div>

      
        <button
          onClick={handleBookNowClick}  
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Book Now
        </button>

        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', marginTop: '10px' }}>
          With real-time availability, smart navigation, and safe locations, you can park stress-free and save time. 
          Our mission is to make urban mobility smarter, safer, and more efficient — one spot at a time.
        </p>
      </div>

      
      <div style={{ width: '400px' }}>
        <LoadScript googleMapsApiKey="AIzaSyD_OyfosQ0_NUo-QIO-pMovrEjspnP0Qcw">
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '400px',
              borderRadius: '10px',
            }}
            center={locations[selectedCity]}
            zoom={14}
          >
            <Marker position={locations[selectedCity]} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Location;
