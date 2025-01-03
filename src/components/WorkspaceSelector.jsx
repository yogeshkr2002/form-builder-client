import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCaretDown, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./WorkspaceSelector.css";

const WorkspaceSelector = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    setIsOpen(false);
  };

  return (
    <div className="workspace-selector">
      <button onClick={() => setIsOpen(!isOpen)} className="workspace-button">
        <div className="avatar-circle">
          <FaUser className="avatar-icon" size={14} />
        </div>
        <span>
          {user?.username ? `${user.username} workspace` : " My Workspace"}
        </span>
        <FaCaretDown />
      </button>

      {isOpen && (
        <div className="workspace-dropdown">
          <div className="user-info">
            <div className="user-profile">
              <div className="user-avatar">
                <FaUser className="avatar-icon" size={16} />
              </div>
              <div className="user-details">
                <span className="user-email">{user?.email || ""}</span>
              </div>
            </div>
          </div>

          <div className="dropdown-menu">
            <button
              onClick={handleSettingsClick}
              className="menu-item settings"
            >
              <FaCog className="menu-icon" />
              <span>Settings</span>
            </button>
            <button onClick={handleLogout} className="menu-item logout">
              <FaSignOutAlt />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;
