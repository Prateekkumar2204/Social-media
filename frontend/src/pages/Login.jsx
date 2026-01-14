import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/Auth";
import "../Scss/Login.scss";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const res = await fetch("http://localhost:3000/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // 🔐 OTP REQUIRED
      if (data.requireOtp) {
        alert("Login OTP sent to your email");
        navigate("/verify-login-otp", { state: { email } });
        return;
      }

      // ❌ LOGIN ERROR
      if (!res.ok) {
        alert(data.error || "Invalid credentials");
        return;
      }

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <section className="login-section">
      <div className="container login-cont">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-uppercase text-center loginheading">Sign in</h2>

          <div className="form-outline mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-outline mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-dark btn-lg btn-block" type="submit">
            Login
          </button>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#8E4585" }}>
              Register here
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
