import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Scss/Register.scss";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false); // ✅ added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent multiple clicks
    setLoading(true);

    try {
      const { name, email, password, confirmPassword } = formData;

      const res = await fetch("http://localhost:3000/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          cpassword: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        window.alert(data.error || "Registration failed");
      } else {
        window.alert("OTP sent to your email");
        navigate("/verify-otp", { state: { email } });
      }
    } catch (err) {
      console.error(err);
      window.alert("Something went wrong");
    } finally {
      setLoading(false); // ✅ re-enable button
    }
  };

  return (
    <section>
      <div className="whole" style={{ backgroundColor: "#735DA5", minHeight: "100vh" }}>
        <div
          className="container register-pane"
          style={{ backgroundColor: "#D3C5E5" }}
        >
          <h2 className="text-uppercase text-center mb-5 mt-2">
            Create an account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-outline mt-2 mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
            </div>

            <div className="form-outline mb-4 mt-4">
              <input
                type="email"
                className="form-control form-control-lg"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="form-outline mb-4 mt-4">
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            <div className="form-outline mb-4 mt-4">
              <input
                type="password"
                className="form-control form-control-lg"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>

            <div className="form-check d-flex justify-content-center mb-3 mt-5">
              <input
                className="form-check-input me-2"
                type="checkbox"
                id="terms"
              />
              <label className="form-check-label" htmlFor="terms">
                I agree with all the statements in{" "}
                <a href="#!" className="text-body">
                  <u>Terms of service</u>
                </a>
              </label>
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-success btn-block btn-lg"
                style={{ background: "black" }}
                disabled={loading} // ✅ disable here
              >
                {loading ? "Registering..." : "Register"} {/* ✅ dynamic text */}
              </button>
            </div>

            <p className="text-center text-muted mt-5 mb-0">
              Have already an account?{" "}
              <Link to="/login" style={{ color: "#8E4585" }}>
                <u>Login here</u>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;