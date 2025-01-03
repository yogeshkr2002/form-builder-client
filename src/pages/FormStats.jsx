import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./FormStats.css";
import baseurl from "../utils/config";

const FormStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchResponses();
  }, [id]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/forms/${id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/forms/${id}/responses`);
      setResponses(response.data);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  if (!stats) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="stats-container">
      <Navbar />
      <div className="stats-content">
        <div className="stats-header">
          <div className="header-left">
            <button onClick={() => navigate(-1)} className="back-button">
              <FaArrowLeft />
            </button>
            <h1 className="stats-title">{stats.formName} - Statistics</h1>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Responses</div>
            <div className="stat-value">{stats.totalResponses}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completion Rate</div>
            <div className="stat-value">{stats.completionRate}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Time</div>
            <div className="stat-value">{stats.averageTime}s</div>
          </div>
        </div>

        <div className="responses-section">
          <h2 className="section-title">Recent Responses</h2>
          {responses.length > 0 ? (
            <table className="responses-table">
              <thead>
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Question</th>
                  <th className="table-header">Answer</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response._id}>
                    <td className="table-cell">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell">{response.question}</td>
                    <td className="table-cell">{response.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No responses yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStats;
