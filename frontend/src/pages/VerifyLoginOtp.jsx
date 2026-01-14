import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/Auth";
import "../Scss/VerifyOtp.scss"; // Import the new styles

export default function VerifyLoginOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/verify-login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // ✅ FETCH USER
      const userRes = await fetch("http://localhost:3000/check", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const userData = await userRes.json();
      setUser(userData.msg);

      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>Login-Verification</h2>
        <p className="subtitle">
          Enter the OTP sent to <br />
          <b>{email}</b>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            className="otp-input"
            placeholder="Enter the 6-digit OTP"
            value={otp}
            maxLength="6"
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
