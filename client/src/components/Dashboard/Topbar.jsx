import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiSun } from "react-icons/fi";
import UserProfileDropdown from "./UserProfileDropdown";
import "./Topbar.css";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Scroll effect (adds depth)
  useEffect(() => {
    const handleScroll = () => {
      const bar = document.querySelector(".topbar");
      if (window.scrollY > 10) {
        bar.classList.add("scrolled");
      } else {
        bar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="topbar">
      
      {/* LOGO */}
      <div className="logo-section">
        <div className="logo-circle">P</div>
        <span className="logo-text">Parkos</span>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input placeholder="Search slots, vehicles, bookings..." />
        <span className="shortcut">⌘ K</span>
      </div>

      {/* RIGHT */}
      <div className="right-section">

        <FiSun className="icon" />

        <div className="notification">
          <FiBell className="icon" />
          <span className="dot"></span>
        </div>

        <div
          className="profile"
          ref={dropdownRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="avatar">
            {user?.displayName?.charAt(0) || "A"}
          </div>

          <div className="user-info">
            <p>{user?.displayName || "Anvith"}</p>
            <span>Operator</span>
          </div>

          {isDropdownOpen && (
            <UserProfileDropdown
              userName={user?.displayName || "User"}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;