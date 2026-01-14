import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Scss/VerifyOtp.scss"; // Import the new styles

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "pramoddubey740@gmail.com";

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    // Logic remains unchanged as requested
    const res = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (!res.ok) {
      window.alert(data.error || "Invalid OTP");
    } else {
      window.alert("Email verified successfully");
      navigate("/login");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>VERIFY EMAIL</h2>
        
        <p className="subtitle">
          Enter the OTP sent to 
          <b>{email}</b>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            className="otp-input"
            placeholder="Enter the 6-digit OTP"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="verify-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;