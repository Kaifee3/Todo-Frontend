import React, { useState } from "react";
import axios from "axios";
import './CSS/TaskForm.css';

const TaskForm = ({ user, addTaskToList }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        title,
        description,
        email: user.email,
        userId: user.id,
      });

      const newTask = response.data;
      alert("Task added successfully!");
      setTitle("");
      setDescription("");

      if (addTaskToList) {
        addTaskToList(newTask); 
      }
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Something went wrong while adding the task.");
    }
  };

  return (
    <div className="add-task-container">
      <form onSubmit={handleSubmit} className="add-task-form">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
