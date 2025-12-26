// src/components/Dashboard/Topbar.js (assuming you named it Topbar.js)
import React, { useEffect, useState, useRef } from 'react'; // Import useRef for click outside
import { auth } from '../../firebase'; // Make sure this path is correct
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // To redirect after logout

import UserProfileDropdown from './UserProfileDropdown'; // Import the new dropdown
import './Topbar.css'; // Existing Topbar CSS

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef(null); // Ref for click outside detection
  const navigate = useNavigate(); // For navigation after logout

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this runs once on mount

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="topbar">
      <div className="welcome-text">
        Welcome back, {user?.displayName || 'User'} 👋
      </div>

      <div className="topbar-right">
        <div className="notification-icon">🔔</div>
        <div className="user-profile-container" ref={dropdownRef}> {/* Attach ref here */}
          <div className="user-icon" onClick={toggleDropdown}> {/* Toggle dropdown on click */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Profile"
                className="profile-image"
              />
            ) : (
              <FaUserCircle size={36} color="#6b7280" />
            )}
          </div>
          {isDropdownOpen && (
            <UserProfileDropdown
              userName={user?.displayName || 'User'}
              onLogout={handleLogout}
              onClose={() => setIsDropdownOpen(false)} // Pass a function to close dropdown
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;