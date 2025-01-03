import { useState } from "react";
import {
  FaEnvelope,
  FaLink,
  FaTimes,
  FaCopy,
  FaCaretDown,
} from "react-icons/fa";
import axios from "axios";
import { showSuccessToast, showErrorToast, showLinkToast } from "./CustomToast";
import "./ShareModal.css";
import baseurl from "../utils/config";

const ShareModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [permission, setPermission] = useState("view");
  const [showPermissionDropdown, setShowPermissionDropdown] = useState(false);

  const generateShareId = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const checkEmail = async (email) => {
    try {
      const response = await axios.post(`${baseurl}/api/auth/check-email`, {
        email,
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEmailShare = async () => {
    if (!email.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const emailExists = await checkEmail(email);
    if (!emailExists) {
      setEmailError(
        "This email is not registered. Please ask the user to register first."
      );
      return;
    }

    setEmailError("");
    showSuccessToast(`Invitation sent to ${email}!`);
    onClose();
  };

  const handleCopyLink = () => {
    const shareId = generateShareId();
    const shareLink = `${window.location.origin}/shared/${shareId}/login`;
    navigator.clipboard.writeText(shareLink);
    showLinkToast("Share link copied to clipboard!");
    onClose();
  };

  return (
    <div className="share-modal">
      <div className="share-content">
        <div className="share-header">
          <h2 className="share-title">Share Form</h2>
          <div className="header-actions">
            <div className="permission-dropdown">
              <button
                onClick={() =>
                  setShowPermissionDropdown(!showPermissionDropdown)
                }
                className="permission-button"
              >
                {permission}
                <FaCaretDown />
              </button>
              {showPermissionDropdown && (
                <div className="permission-options">
                  <button
                    onClick={() => {
                      setPermission("view");
                      setShowPermissionDropdown(false);
                    }}
                    className="permission-option"
                  >
                    view
                  </button>
                  <button
                    onClick={() => {
                      setPermission("edit");
                      setShowPermissionDropdown(false);
                    }}
                    className="permission-option"
                  >
                    edit
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="close-button">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="share-body">
          <div className="share-section">
            <div className="section-header">
              <FaEnvelope className="section-icon" />
              <span className="section-title">Share by Email</span>
            </div>
            <div className="email-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Enter email address"
                className={`email-input ${emailError ? "error" : ""}`}
              />
              <button onClick={handleEmailShare} className="send-button">
                Send
              </button>
            </div>
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="share-section">
            <div className="section-header">
              <FaLink className="section-icon" />
              <span className="section-title">Get Link</span>
            </div>
            <button onClick={handleCopyLink} className="copy-link-button">
              <FaCopy />
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
