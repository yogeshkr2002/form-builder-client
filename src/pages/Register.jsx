import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { FaArrowLeft } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Attempting registration with:", {
      username: formData.username,
      email: formData.email,
    });

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );
    console.log("Registration result:", result);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="back-arrow" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>
      <img src="/images/triangle.png" alt="left-shape" className="left-shape" />
      <img
        src="/images/right-half-circle.png"
        alt="right-shape"
        className="right-shape"
      />
      <img
        src="/images/bottom-half-circle.png"
        alt="bottom-shape"
        className="bottom-shape"
      />
      <div className="login-box">
        <h2 className="login-title">Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="loginInput"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="loginInput"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Sign Up
          </button>
          <button type="button" className="login-button">
            <img
              src="/images/google-logo.png"
              alt="Google logo"
              className="google-logo"
            />
            Sign up with Google
          </button>
        </form>
        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/login" className="register-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
