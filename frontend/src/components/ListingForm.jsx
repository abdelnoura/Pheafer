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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a listing.');
      return;
    }
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
      const res = await axios.post('http://localhost:8000/api/listings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onNewListing(res.data);
      // Reset form
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Create New Listing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Latitude:</label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Longitude:</label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Price (USD):</label>
          <input
            type="number"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Sq Ft:</label>
          <input
            type="number"
            step="any"
            value={squareFootage}
            onChange={(e) => setSquareFootage(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ceiling Height (ft):</label>
          <input
            type="number"
            step="any"
            value={ceilingHeight}
            onChange={(e) => setCeilingHeight(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Dock Doors (#):</label>
          <input
            type="number"
            step="1"
            value={dockDoors}
            onChange={(e) => setDockDoors(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Power Capacity:</label>
          <input
            type="text"
            value={powerCapacity}
            onChange={(e) => setPowerCapacity(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Zoning Type:</label>
          <input
            type="text"
            value={zoningType}
            onChange={(e) => setZoningType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Create Listing
      </button>
    </form>
);
}

export default ListingForm;

