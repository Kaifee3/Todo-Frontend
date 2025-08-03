import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/Home.css";
import { Link } from "react-router-dom";
import TaskForm from "../components/TaskForm";

const Home = ({ user: passedUser }) => {
  const [user, setUser] = useState(() => {
    if (passedUser) return passedUser;
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  });

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideImages = ["/images/s1.png", "/images/s2.png", "/images/s3.png"];
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    if (!user?.email) return;
    try {
      const response = await axios.get(`${API_URL}/api/tasks/${user.email}`);
      setTasks(response.data.reverse());
    } catch (err) {
      console.error(" Error fetching tasks:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error(" Error deleting task:", err);
    }
  };

  const confirmTask = async (id) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, { status: "Confirmed" });
      fetchTasks();
    } catch (err) {
      console.error("Error confirming task:", err);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, {
        title: editedTitle,
        description: editedDescription,
      });
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  const addTaskToList = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div className="slideshow">
        {slideImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          />
        ))}
      </div>

      {!user ? (
        <div className="not-logged-in">
          <h2>Welcome to Task Manager</h2>
          <p>Please log in to view and manage your tasks.</p>
          <Link to="/login" className="login-button">Login</Link>
          <Link to="/register" className="register-button">Register</Link>
        </div>
      ) : (
        <>
          <TaskForm
            fetchTasks={fetchTasks}
            user={user}
            addTaskToList={addTaskToList}
          />

          <div className="task-section">
            <h3>Your Tasks</h3>
            {tasks.filter((task) => task.status !== "Confirmed").length === 0 ? (
              <p>No tasks yet.</p>
            ) : (
              <ul className="task-list">
                {tasks
                  .filter((task) => task.status !== "Confirmed")
                  .map((task) => (
                    <li key={task._id} className="task-card">
                      {editingTaskId === task._id ? (
                        <>
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="edit-input"
                            placeholder="Edit title"
                          />
                          <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="edit-textarea"
                            placeholder="Edit description"
                          ></textarea>
                          <div className="task-buttons">
                            <button
                              onClick={() => saveEdit(task._id)}
                              className="text-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4>{task.title}</h4>
                          {task.description && <p>{task.description}</p>}
                          <div className="task-buttons">
                            <button
                              onClick={() => startEditing(task)}
                              className="text-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="text-red-600"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => confirmTask(task._id)}
                              className="text-green-700"
                            >
                              Confirm
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
