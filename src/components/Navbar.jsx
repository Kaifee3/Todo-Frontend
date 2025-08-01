import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  console.log('🔍 Navbar Debug - User prop:', user);
  console.log('🔍 Navbar Debug - User type:', typeof user);
  console.log('🔍 Navbar Debug - User keys:', user ? Object.keys(user) : 'null');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isLoggedIn = user && user.email && (user.firstName || user.email);

  return (
    <nav style={{ backgroundColor: '#eee', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Link to="/">Home</Link>
      <Link to="/history">History</Link>
      <Link to="/profile">Profile</Link>

      {user?.role === 'admin' && (
        <Link to="/admin">Admin Panel</Link>
      )}

      {isLoggedIn ? (
        <>
          <span style={{ marginLeft: 'auto' }}>
            Welcome, {user.firstName || user.email}
          </span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </>
      ) : (
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
