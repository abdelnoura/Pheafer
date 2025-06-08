// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar'; // optional, if you have a NavBar

function App() {
  return (
    <>
      {/* If you have a NavBar, render it here */}
      {/* <NavBar /> */}

      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Home Route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Protected Listing Details */}
        <Route
          path="/listing/:id"
          element={
            <PrivateRoute>
              <ListingDetails />
            </PrivateRoute>
          }
        />

        {/* Fallback: any unknown path redirects to Home (protected) */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
