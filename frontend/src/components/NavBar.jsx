// src/components/NavBar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      style={{
        backgroundColor: '#1976D2',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Pheafer
        </Link>
      </div>
      <div>
        {token ? (
          // If logged in, show Logout
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#E53935',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Logout
          </button>
        ) : (
          // If not logged in, show Register and Login links
          <>
            <Link
              to="/register"
              style={{
                color: 'white',
                marginRight: '1rem',
                textDecoration: 'none'
              }}
            >
              Register
            </Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
