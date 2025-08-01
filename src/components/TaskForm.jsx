import React, { useState } from "react";
import axios from "axios";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user info

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
        userId: user.id, // optional for admin features
      });

      console.log("✅ Task created:", response.data);
      alert("Task added successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("❌ Failed to create task:", err);
      alert("Something went wrong while adding task.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <br />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;
