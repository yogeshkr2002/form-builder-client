import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const { user, updateUserProfile, updatePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let hasChanges = false;

      // Handle password update if provided
      if (oldPassword || newPassword) {
        if (!oldPassword) {
          throw new Error("Current password is required to update password");
        }
        if (!newPassword) {
          throw new Error("New password is required");
        }
        if (newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long");
        }

        hasChanges = true;
        await updatePassword(oldPassword, newPassword);
        setOldPassword("");
        setNewPassword("");
      }

      // Handle profile updates
      if (username !== user.username || email !== user.email) {
        hasChanges = true;
        if (!username.trim()) {
          throw new Error("Username is required");
        }

        if (!validateEmail(email)) {
          throw new Error("Please enter a valid email address");
        }

        await updateUserProfile(username, email);
      }

      if (!hasChanges) {
        throw new Error("No changes to save");
      }

      setSuccess("Settings updated successfully!");
    } catch (err) {
      console.error("Settings update error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Current Password</label>
          <div className="password-input">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="password-toggle"
              tabIndex="-1"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>
          <div className="password-input">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="password-toggle"
              tabIndex="-1"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving Changes..." : "Update"}
        </button>
      </form>

      <button onClick={handleLogout} className="logout-button">
        <span>
          <FaSignOutAlt />
          Logout
        </span>
      </button>
    </div>
  );
};

export default Settings;
