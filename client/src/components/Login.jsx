import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../firebase"; 
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ---------- Manual Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = { email, password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/manual-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Login failed:", errData);
        alert("❌ " + (errData.message || "Login failed"));
        return;
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);

      // Store both user info and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      alert(`Welcome, ${data.user.name || data.user.email}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Login error: " + err.message);
    }
  };

  // ---------- Google Login ----------
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase token
      const firebaseToken = await user.getIdToken();

      // Send Firebase token to backend to get your app JWT
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Backend login failed:", error);
        alert("Backend login failed: " + error.message);
        return;
      }

      const data = await res.json();
      console.log("✅ Backend login successful:", data);

      // Store both user info and backend JWT
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      alert(`Login successful: Welcome ${data.user.name || data.user.email}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err.message);
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="or-divider">OR</div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
          Continue with Google
        </button>

        <div className="login-links">
          <a href="/forgot-password">Forgot password?</a>
          <span> | </span>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
