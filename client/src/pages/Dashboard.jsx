import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../assets/css/dashboard.css";
import AIChatbot from "../components/AIChatbot";

import {
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const [approvedComplaints, setApprovedComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (!data) {
      navigate("/login");
      return;
    }

    setUser(data);

    // 💡 
    const userId = data.id || data.user_id;

    if (userId) {
      loadDashboard(userId);
      loadResolved(userId);
      loadFeedback(userId);
    }
  }, [navigate]);

  const loadDashboard = async (id) => {
  try {
    const res = await API.get(`/dashboard/${id}`);
    console.log("DASHBOARD DATA:", res.data);

    // Tukar String "0" kepada Nombor 0 secara paksa
    setStats({
      total: parseInt(res.data.total, 10) || 0,
      pending: parseInt(res.data.pending, 10) || 0,
      progress: parseInt(res.data.progress || res.data.in_progress || res.data.inProgress, 10) || 0,
      resolved: parseInt(res.data.resolved, 10) || 0,
    });
  } catch (err) {
    console.log(err);
  }
};

  const loadResolved = async (id) => {
    try {
      const res = await API.get(`/approved-complaints/${id}`);
      setApprovedComplaints(res.data);
    } catch (err) {
      console.log("Error loadResolved:", err);
    }
  };

  const loadFeedback = async (id) => {
    try {
      const res = await API.get(`/my-feedback/${id}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.log("Error loadFeedback:", err);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-card">
          {/* HEADER */}
          <div className="dashboard-header">
            <div>
              <h1>Welcome Back, {user.fullname}</h1>
              <p>Manage your laundry complaints and feedback</p>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="stats-grid">
            <div className="stat-box">
              <FaClipboardList />
              <div>
                <span>Total Complaints</span>
                <h2>{stats.total}</h2>
              </div>
            </div>

            <div className="stat-box">
              <FaClock />
              <div>
                <span>Pending</span>
                <h2>{stats.pending}</h2>
              </div>
            </div>

            <div className="stat-box">
              <FaSpinner />
              <div>
                <span>In Progress</span>
                <h2>{stats.progress}</h2>
              </div>
            </div>

            <div className="stat-box">
              <FaCheckCircle />
              <div>
                <span>Resolved</span>
                <h2>{stats.resolved}</h2>
              </div>
            </div>
          </div>

          {/* RESOLVED COMPLAINT SECTION */}
          <div className="dashboard-card">
            <div className="section-header">
              <h2>Resolved Complaints</h2>
              <p>Recently completed complaints</p>
            </div>

            {approvedComplaints.length === 0 ? (
              <div className="empty-box">No resolved complaints available.</div>
            ) : (
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Complaint Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedComplaints.map((item) => (
                      <tr key={item.complaint_id}>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td>
                          <span className="status resolved">{item.status}</span>
                        </td>
                        <td>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* FEEDBACK SECTION */}
          <div className="dashboard-card">
            <div className="section-header">
              <h2>Customer Feedback</h2>
              <p>Your submitted feedback</p>
            </div>

            {feedbacks.length === 0 ? (
              <div className="empty-box">No feedback submitted yet.</div>
            ) : (
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Complaint</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          <span className="rating">
                            {"★".repeat(item.rating)}
                          </span>
                        </td>
                        <td>{item.comment}</td>
                        <td>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
