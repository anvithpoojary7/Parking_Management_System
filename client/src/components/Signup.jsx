import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth, provider, signInWithPopup } from "../firebase"; // ✅ your Firebase config path

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const navigate = useNavigate();

  // ---------- Handle input changes ----------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------- Manual Signup ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: password match validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/signup/manual-signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup failed:", data);
        alert(data.message || "Signup failed");
        return;
      }

      // ✅ Store user info and JWT token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      alert(`Welcome, ${data.user.name || data.user.email}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // ---------- Google Signup ----------
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase token
      const firebaseToken = await user.getIdToken();

      // Send Firebase token to backend to get app JWT
      const res = await fetch("http://localhost:5000/api/signup/google-signup", {
        method: "POST",
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Google Sign-Up failed:", errData);
        alert("Google Sign-Up failed: " + (errData.message || "Unknown error"));
        return;
      }

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      console.log("Google Sign-Up Success:", data.user);
      alert(`Welcome, ${data.user.name || data.user.email}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      alert("Google Sign-Up failed!");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2 className="signup-title">Create Account</h2>

        {/* Manual Signup Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="signup-input"
          />
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="or-divider">
          <span className="line" /> <span className="or-text">OR</span>{" "}
          <span className="line" />
        </div>

        {/* Google Signup */}
        <button className="google-btn" onClick={handleGoogleSignup}>
          <FcGoogle size={20} style={{ marginRight: "10px" }} />
          Continue with Google
        </button>

        <div className="signup-links">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
