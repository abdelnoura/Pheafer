// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingForm from '../components/ListingForm';
import MapSearch from '../components/MapSearch';
import ListingSidebar from '../components/ListingSidebar';

function Home() {
  const [listings, setListings] = useState([]);
  const [focusListing, setFocusListing] = useState(null);

  // 1. Fetch listings on mount
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/listings')
      .then((res) => setListings(res.data))
      .catch((err) => console.error('Error fetching listings:', err));
  }, []);

  // 2. Callback when a new listing is created
  const handleNewListing = (newListing) => {
    setListings((prev) => [...prev, newListing]);
  };

  // 3. Callback when a listing is deleted
  const handleDelete = (id) => {
    setListings((prev) => prev.filter((li) => li._id !== id));
  };

  // 4. Callback when a listing is edited
  const handleEdit = (updatedListing) => {
    setListings((prev) =>
      prev.map((li) => (li._id === updatedListing._id ? updatedListing : li))
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar on Left (20% width on lg+) */}
      <div className="lg:w-1/5 h-1/3 lg:h-full overflow-auto">
        <ListingSidebar
          listings={listings}
          onSelect={(listing) => setFocusListing(listing)}
        />
      </div>

      {/* Main Area on Right */}
      <div className="lg:w-4/5 flex flex-col">
        {/* Add Listing Form at Top */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <ListingForm onNewListing={handleNewListing} />
        </div>

        {/* Map occupies remaining space */}
        <div className="flex-1">
          <MapSearch
            listings={listings}
            onDelete={handleDelete}
            onEdit={handleEdit}
            focusListing={focusListing}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;

