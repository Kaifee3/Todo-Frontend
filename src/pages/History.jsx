import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Your Task History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-700 mb-1">{task.description}</p>
              <p className="text-sm">
                <strong>Status:</strong> <span className="italic">{task.status}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
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
