import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/History.css";

const History = ({ user: passedUser }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusChanges, setStatusChanges] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const user = passedUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tasks/${user.email}`);
        setTasks(res.data.reverse());
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.email]);

  const handleStatusChange = (taskId, newStatus) => {
    setStatusChanges((prev) => ({ ...prev, [taskId]: newStatus }));
  };

  const handleSaveStatus = async (taskId) => {
    const newStatus = statusChanges[taskId];
    if (!newStatus) return;

    try {
      await axios.put(`${API_URL}/api/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  if (!user?.email) {
    return (
      <div className="history-container">
        <h2 className="history-title">Task History</h2>
        <div className="login-box">
          <p className="login-required">
            You need to be logged in to view your task history.
          </p>
          <button className="login-link" onClick={() => navigate("/login")}>
            Click here to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2 className="history-title">Your Task History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <div className="status-select">
                <label>
                  <strong>Status:</strong>{" "}
                  <select
                    value={statusChanges[task._id] || task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
                {statusChanges[task._id] && (
                  <button
                    className="save-status-btn"
                    onClick={() => handleSaveStatus(task._id)}
                  >
                    Save
                  </button>
                )}
              </div>

              <p className="timestamp">
                <strong>Added on:</strong>{" "}
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
