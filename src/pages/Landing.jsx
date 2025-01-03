import { useNavigate } from "react-router-dom";
import "./Landing.css";
import Footer from "../components/Footer";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="header">
        <div className="logo">
          <img src="/images/logo.png" alt="FormBot Logo" className="logo-img" />
        </div>
        <div className="buttons">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
          <button
            className="btnFormbot btn-primary"
            onClick={() => navigate("/login")}
          >
            Create a FormBot
          </button>
        </div>
      </nav>
      <div className="bodyContainer">
        <img src="/images/body.png" alt="FormBot Logo" />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
