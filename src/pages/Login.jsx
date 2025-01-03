import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      localStorage.setItem("token", result.token);
      navigate("/home");
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
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="login-button">
            Log In
          </button>
          <button type="button" className="login-button">
            <img
              src="/images/google-logo.png"
              alt="Google logo"
              className="google-logo"
            />
            Sign in with Google
          </button>
        </form>
        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
