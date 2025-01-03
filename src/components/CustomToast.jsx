import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaCheckCircle, FaTimesCircle, FaLink, FaTimes } from "react-icons/fa";
import "./CustomToast.css";

const Toast = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="toast-icon" />;
      case "error":
        return <FaTimesCircle className="toast-icon" />;
      case "link":
        return <FaLink className="toast-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className={`toast toast-${type} ${isExiting ? "toast-exit" : ""}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      <button onClick={handleClose} className="toast-close">
        <FaTimes />
      </button>
    </div>
  );
};

// Create a container for toasts if it doesn't exist
const createToastContainer = () => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  return container;
};

let toastId = 0;

const createToast = (message, type) => {
  const container = createToastContainer();
  const toastElement = document.createElement("div");
  toastElement.id = `toast-${toastId++}`;
  container.appendChild(toastElement);

  const handleClose = () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(toastElement);
      container.removeChild(toastElement);
      if (container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  };

  ReactDOM.render(
    <Toast message={message} type={type} onClose={handleClose} />,
    toastElement
  );
};

export const showSuccessToast = (message) => createToast(message, "success");
export const showErrorToast = (message) => createToast(message, "error");
export const showLinkToast = (message) => createToast(message, "link");
