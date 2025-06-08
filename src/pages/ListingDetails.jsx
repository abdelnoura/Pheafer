// src/pages/ListingDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing details.');
      }
    };
    fetchListing();
  }, [id]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!listing) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">{listing.name}</h1>
      <p className="mb-2">
        <span className="font-medium">City:</span> {listing.city}
      </p>
      <p className="mb-2">
        <span className="font-medium">Latitude:</span> {listing.latitude}
      </p>
      <p className="mb-2">
        <span className="font-medium">Longitude:</span> {listing.longitude}
      </p>
      <p className="mb-2">
        <span className="font-medium">Price:</span> ${listing.price.toLocaleString()}
      </p>
      <p className="mb-2">
        <span className="font-medium">Square Footage:</span> {listing.squareFootage.toLocaleString()}
      </p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Detailed Specs</h2>
        <p className="mb-2">
          <span className="font-medium">Ceiling Height:</span> {listing.specs.ceilingHeight} ft
        </p>
        <p className="mb-2">
          <span className="font-medium">Dock Doors:</span> {listing.specs.dockDoors}
        </p>
        <p className="mb-2">
          <span className="font-medium">Power Capacity:</span> {listing.specs.powerCapacity}
        </p>
        <p className="mb-2">
          <span className="font-medium">Zoning Type:</span> {listing.specs.zoningType}
        </p>
      </div>

      {/* If you later add images or other data, show them here */}
    </div>
  );
}

export default ListingDetails;
