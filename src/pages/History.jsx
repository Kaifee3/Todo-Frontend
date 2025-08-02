import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/History.css";

const History = ({ user: passedUser }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // ⛔ Not logged in → show login prompt
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

  // ✅ Logged in → show tasks
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
              <p className="status">
                <strong>Status:</strong> {task.status}
              </p>
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
