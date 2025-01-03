import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import WorkspaceSelector from "./WorkspaceSelector";
import ShareModal from "./ShareModal";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <WorkspaceSelector />
          </div>
          <div className="navbar-right">
            <ThemeToggle />

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="share-button"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {isShareModalOpen && (
        <ShareModal onClose={() => setIsShareModalOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
