import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const isLoggedIn = user && user.email && (user.firstName || user.email);

  return (
    <nav className="navbar">
      <div className="navbar-row">
        <div className="navbar-header">
          <Link to="/" className="navbar-logo">
            MyApp
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            &#9776;
          </button>
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/history" onClick={() => setMenuOpen(false)}>
            History
          </Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}
          {isLoggedIn ? (
            <div className="navbar-welcome-container">
              <span className="navbar-welcome">Welcome,</span>
              <span className="navbar-welcome">{user.firstName}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
