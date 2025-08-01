import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Home from './pages/Home.jsx';
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import History from "./pages/History";

const ProtectedRoute = ({ children, user }) => {
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  const [user, setUser] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      
      console.log('🔍 Debug - Token:', token);
      console.log('🔍 Debug - Stored User:', storedUser);
      
      if (!token) {
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('🔍 Debug - Setting user from localStorage:', parsedUser);
            setUser(parsedUser);
          } catch (err) {
            console.error('Error parsing stored user:', err);
            setUser(null);
          }
        }
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('🔍 Debug - Backend response:', response.data);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error fetching user from backend:', err);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('🔍 Debug - Fallback to stored user:', parsedUser);
            setUser(parsedUser);
          } catch (parseErr) {
            console.error('Error parsing stored user:', parseErr);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log('🔍 Debug - User state changed:', user);
  }, [user]);

  const handleLogout = () => {
    console.log('🔍 Debug - Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={
          <ProtectedRoute user={user}>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <ProtectedRoute user={user}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/history" element={<History user={user} />} />
        <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
