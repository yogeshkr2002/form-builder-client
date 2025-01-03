import { useNavigate } from "react-router-dom";
import { FaRobot, FaChartBar, FaShare } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import ThemeToggle from "../components/ThemeToggle";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">FormBuilder</div>
          <div className="header-actions">
            <ThemeToggle />
            <button
              onClick={() => navigate("/login")}
              className="signup-button"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/login")}
              className="signup-button"
            >
              create typebot
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <h1 className="hero-title">Create Interactive Forms with Ease</h1>
        <p className="hero-subtitle">
          Build engaging conversational forms that boost response rates. No
          coding required - just drag, drop, and customize.
        </p>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRobot />
            </div>
            <h3 className="feature-title">Conversational Interface</h3>
            <p className="feature-description">
              Create natural, flowing conversations that keep users engaged and
              improve completion rates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BsLightningCharge />
            </div>
            <h3 className="feature-title">Easy to Use</h3>
            <p className="feature-description">
              Intuitive drag-and-drop interface makes form creation quick and
              simple. No technical skills needed.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaChartBar />
            </div>
            <h3 className="feature-title">Analytics & Insights</h3>
            <p className="feature-description">
              Track form performance, completion rates, and user behavior with
              detailed analytics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
