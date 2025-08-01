import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/History.css";
const History = ({ user: passedUser }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const user = passedUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.email) {
      console.warn("User email not found");
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
