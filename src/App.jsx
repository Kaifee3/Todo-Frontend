import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import History from './pages/History';
import Footer from './components/Footer';
import './App.css'; 

const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children, user }) => {
  // Allow access to login and register pages even when logged in
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (err) {
            console.error('Error parsing stored user:', err);
            setUser(null);
          }
        }
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error fetching user from backend:', err);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
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

  // Listen for storage changes (when user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (err) {
            console.error('Error parsing stored user:', err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <PublicRoute user={user}>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute user={user}>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route path="/admin" element={<ProtectedRoute user={user}><AdminPanel /></ProtectedRoute>} />
          <Route path="/history" element={<History user={user} />}/>
          <Route path="/profile" element={<Profile user={user}/>}/>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;