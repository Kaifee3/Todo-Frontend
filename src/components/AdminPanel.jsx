import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/AdminPanel.css';

function AdminPanel() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, { headers });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/api/tasks/${id}`, { status }, { headers });
      fetchAllTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/api/tasks/${id}`, { headers });
        fetchAllTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`, { headers });
        fetchAllUsers();
      } catch (err) {
        try {
          await axios.delete(`${API_URL}/api/users/delete-user`, {
            data: { userId: id },
            headers
          });
          fetchAllUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Error deleting user: " + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const editUser = (user) => {
    setEditingUser({ ...user, originalEmail: user.email });
    setShowUserModal(true);
  };

  const editTask = (task) => {
    setEditingTask({ ...task });
    setShowTaskModal(true);
  };

  const handleUserUpdate = async () => {
    try {
      const {
        originalEmail,
        firstName,
        lastName,
        email,
        mobile,
        gender,
        role
      } = editingUser;

      await axios.put(`${API_URL}/api/users/update-user`, {
        originalEmail,
        firstName,
        lastName,
        email,
        mobile,
        gender,
        role
      }, { headers });

      setShowUserModal(false);
      setEditingUser(null);
      fetchAllUsers();
      alert('User updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error updating user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleTaskUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/tasks/${editingTask._id}`, editingTask, { headers });
      setShowTaskModal(false);
      setEditingTask(null);
      fetchAllTasks();
      alert('Task updated successfully!');
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Error updating task: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchAllTasks();
    fetchAllUsers();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <div className="toggle-buttons">
        <button
          onClick={() => setView('users')}
          className={view === 'users' ? 'active' : 'inactive'}
        >
          Users
        </button>
        <button
          onClick={() => setView('tasks')}
          className={view === 'tasks' ? 'active' : 'inactive'}
        >
          Tasks
        </button>
      </div>

      {view === 'users' && (
        <div>
          <h3>Users</h3>
          {users.map(user => (
            <div key={user._id} className="card">
              <div className="card-info">
                <strong>{user.firstName} {user.lastName}</strong> - {user.email} ({user.role})
              </div>
              <div className="card-actions">
                <button onClick={() => editUser(user)} className="btn-edit">Edit</button>
                <button onClick={() => deleteUser(user._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'tasks' && (
        <div>
          <h3>Tasks</h3>
          {tasks.map(task => (
            <div key={task._id} className="card">
              <div className="card-info">
                <div className="task-detail"><span>Task:</span> {task.title}</div>
                <div className="task-detail"><span>Description:</span> {task.description}</div>
                <div className="task-detail"><span>Status:</span> {task.status}</div> {/* 👈 Added */}
                <div className="task-detail"><span>Added By:</span> {task.userId?.firstName} ({task.userId?.email})</div>
                <div className="task-detail"><span>Date:</span> {new Date(task.createdAt).toLocaleString()}</div>
              </div>
              <div className="card-actions">
                <button onClick={() => editTask(task)} className="btn-edit">Edit</button>
                <button onClick={() => deleteTask(task._id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUserModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>
            <input type="text" placeholder="First Name" value={editingUser.firstName} onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })} />
            <input type="text" placeholder="Last Name" value={editingUser.lastName} onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })} />
            <input type="email" placeholder="Email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
            <input type="text" placeholder="Mobile" value={editingUser.mobile || ''} onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })} />
            <select value={editingUser.gender || ''} onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleUserUpdate} className="btn-update">Update</button>
              <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && editingTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input type="text" placeholder="Title" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
            <textarea placeholder="Description" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
            <select value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleTaskUpdate} className="btn-update">Update</button>
              <button onClick={() => { setShowTaskModal(false); setEditingTask(null); }} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
