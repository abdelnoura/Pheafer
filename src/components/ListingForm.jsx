// src/components/ListingForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

function ListingForm({ onNewListing }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [price, setPrice] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [dockDoors, setDockDoors] = useState('');
  const [powerCapacity, setPowerCapacity] = useState('');
  const [zoningType, setZoningType] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to create a listing.');
      return;
    }

    // Validate every field
    if (
      !name.trim() ||
      !city.trim() ||
      latitude === '' ||
      longitude === '' ||
      price === '' ||
      squareFootage === '' ||
      ceilingHeight === '' ||
      dockDoors === '' ||
      !powerCapacity.trim() ||
      !zoningType.trim()
    ) {
      alert('All fields are required.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        city: city.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        price: Number(price),
        squareFootage: Number(squareFootage),
        specs: {
          ceilingHeight: Number(ceilingHeight),
          dockDoors: Number(dockDoors),
          powerCapacity: powerCapacity.trim(),
          zoningType: zoningType.trim()
        }
      };
      const res = await axios.post(
        'http://localhost:8000/api/listings',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onNewListing(res.data);
      // Reset all fields
      setName('');
      setCity('');
      setLatitude('');
      setLongitude('');
      setPrice('');
      setSquareFootage('');
      setCeilingHeight('');
      setDockDoors('');
      setPowerCapacity('');
      setZoningType('');
    } catch (err) {
      console.error('Error creating listing:', err);
      alert(err.response?.data?.error || 'Failed to create listing.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold mb-4">Create New Listing</h2>

      <div>
        <label className="block font-medium mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Listing name"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Latitude:</label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g. 34.052235"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Longitude:</label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g. -118.243683"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Price (USD):</label>
          <input
            type="number"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 1500000"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Square Footage:</label>
          <input
            type="number"
            step="any"
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            placeholder="e.g. 25000"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-4">Detailed Specs</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Ceiling Height (ft):</label>
          <input
            type="number"
            step="any"
            value={ceilingHeight}
            onChange={(e) => setCeilingHeight(e.target.value)}
            placeholder="e.g. 24"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Dock Doors (#):</label>
          <input
            type="number"
            value={dockDoors}
            onChange={(e) => setDockDoors(e.target.value)}
            placeholder="e.g. 4"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Power Capacity:</label>
        <input
          type="text"
          value={powerCapacity}
          onChange={(e) => setPowerCapacity(e.target.value)}
          placeholder="e.g. 3 Phase, 400A"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Zoning Type:</label>
        <input
          type="text"
          value={zoningType}
          onChange={(e) => setZoningType(e.target.value)}
          placeholder="e.g. Light Industrial"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Create Listing
      </button>
    </form>
  );
}

export default ListingForm;
