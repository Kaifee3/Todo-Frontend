import React, { useEffect, useState } from "react";
import axios from "axios";
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
    const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    if (!user?.email) return;
    try {
      const response = await axios.get(`${API_URL}/api/tasks/${user.email}`);
      setTasks(response.data.reverse());
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
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

  if (!user) return <p>Please log in to view your tasks.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}</h1>

      <TaskForm fetchTasks={fetchTasks} user={user} addTaskToList={addTaskToList} />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Your Tasks</h3>
        {tasks.filter((task) => task.status !== "Confirmed").length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul className="space-y-3">
            {tasks
              .filter((task) => task.status !== "Confirmed")
              .map((task) => (
                <li key={task._id} className="bg-gray-100 p-3 rounded shadow">
                  {editingTaskId === task._id ? (
                    <>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="border p-1 mb-2 w-full"
                        placeholder="Edit title"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="border p-1 mb-2 w-full"
                        placeholder="Edit description"
                      ></textarea>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(task._id)} className="text-green-600">Save</button>
                        <button onClick={cancelEdit} className="text-gray-500">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold">{task.title}</h4>
                      {task.description && <p>{task.description}</p>}
                      <div className="flex gap-4 mt-2">
                        <button onClick={() => startEditing(task)} className="text-blue-600">Edit</button>
                        <button onClick={() => deleteTask(task._id)} className="text-red-600">Delete</button>
                        <button onClick={() => confirmTask(task._id)} className="text-green-700">Confirm</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
