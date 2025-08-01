import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isLoggedIn = user && user.email && (user.firstName || user.email);

  return (
    <nav className="navbar">
      <div className="navbar-row">
        <div className="navbar-header">
          <span className="navbar-logo">MyApp</span>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            &#9776;
          </button>
        </div>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/history">History</Link>
          <Link to="/profile">Profile</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {isLoggedIn ? (
            <>
              <span className="navbar-welcome">Welcome, {user.firstName || user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
