// src/components/MapSearch.jsx

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const defaultCenter = { lat: 37.0902, lng: -95.7129 };

function MapSearch({ listings, onDelete, onEdit, focusListing }) {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedId, setSelectedId] = useState(null);
  const [editingListing, setEditingListing] = useState(null);

  const token = localStorage.getItem('token');

  // Whenever focusListing changes, re-center the map
  useEffect(() => {
    if (focusListing) {
      setMapCenter({
        lat: focusListing.latitude,
        lng: focusListing.longitude
      });
      setCity(focusListing.city);
    }
  }, [focusListing]);

  // Center map on first match if searching manually
  const handleSearch = () => {
    const filtered = listings.filter((li) =>
      li.city.toLowerCase().includes(city.trim().toLowerCase())
    );
    if (filtered.length > 0) {
      setMapCenter({
        lat: filtered[0].latitude,
        lng: filtered[0].longitude
      });
    }
  };

  // Handle inline edits
  const handleChange = (field, value) => {
    setEditingListing((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to edit a listing.');
      return;
    }
    const {
      _id,
      name,
      city: editCity,
      latitude,
      longitude,
      price,
      squareFootage,
      specs
    } = editingListing;

    // Validate every field
    if (
      !name.trim() ||
      !editCity.trim() ||
      latitude === '' ||
      longitude === '' ||
      price === '' ||
      squareFootage === '' ||
      specs.ceilingHeight === '' ||
      specs.dockDoors === '' ||
      !specs.powerCapacity.trim() ||
      !specs.zoningType.trim()
    ) {
      alert('All fields—including specs—are required.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        city: editCity.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        price: Number(price),
        squareFootage: Number(squareFootage),
        specs: {
          ceilingHeight: Number(specs.ceilingHeight),
          dockDoors: Number(specs.dockDoors),
          powerCapacity: specs.powerCapacity.trim(),
          zoningType: specs.zoningType.trim()
        }
      };
      const res = await axios.put(
        `http://localhost:8000/api/listings/${_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onEdit(res.data);
      setEditingListing(null);
      setSelectedId(null);
      alert('Listing updated successfully.');
    } catch (err) {
      console.error('Error updating listing:', err);
      alert(err.response?.data?.error || 'Failed to update listing.');
    }
  };

  // Determine which listings to display based on city filter
  const displayed = city.trim()
    ? listings.filter((li) =>
        li.city.toLowerCase().includes(city.trim().toLowerCase())
      )
    : listings;

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 flex gap-2 border-b border-gray-200 bg-gray-50">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city to filter..."
          className="flex-grow border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Google Map */}
      <div className="flex-1">
        <LoadScript googleMapsApiKey="AIzaSyBRx0SYwNGDsX_YQJg_MoYkRA0zQ-FMFp8">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={8}
          >
            {displayed.map((listing) => (
              <Marker
                key={listing._id}
                position={{ lat: listing.latitude, lng: listing.longitude }}
                title={listing.name}
                onClick={() => setSelectedId(listing._id)}
              />
            ))}

            {selectedId &&
              (() => {
                const li = listings.find((l) => l._id === selectedId);
                if (!li) return null;
                return (
                  <InfoWindow
                    position={{ lat: li.latitude, lng: li.longitude }}
                    onCloseClick={() => {
                      setSelectedId(null);
                      setEditingListing(null);
                    }}
                  >
                    <div className="min-w-[250px]">
                      <strong>{li.name}</strong>
                      <br />
                      {li.city}
                      <br />
                      <span className="font-medium">Price:</span> ${li.price.toLocaleString()}
                      <br />
                      <span className="font-medium">Sq Ft:</span> {li.squareFootage.toLocaleString()}
                      <br />
                      <span className="font-medium">Ceiling:</span> {li.specs.ceilingHeight} ft
                      <br />
                      <span className="font-medium">Dock Doors:</span> {li.specs.dockDoors}
                      <br />
                      <span className="font-medium">Power:</span> {li.specs.powerCapacity}
                      <br />
                      <span className="font-medium">Zoning:</span> {li.specs.zoningType}
                      <br /><br />

                      {/* Delete Button */}
                      <button
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded mr-2"
                        onClick={async () => {
                          if (!token) {
                            alert('You must be logged in to delete a listing.');
                            return;
                          }
                          try {
                            await axios.delete(
                              `http://localhost:8000/api/listings/${li._id}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            onDelete(li._id);
                            setSelectedId(null);
                          } catch (err) {
                            console.error('Delete error:', err);
                            alert(err.response?.data?.error || 'Failed to delete.');
                          }
                        }}
                      >
                        Delete
                      </button>

                      {/* Edit Button */}
                      <button
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2"
                        onClick={() => {
                          setEditingListing({
                            _id: li._id,
                            name: li.name,
                            city: li.city,
                            latitude: li.latitude,
                            longitude: li.longitude,
                            price: li.price,
                            squareFootage: li.squareFootage,
                            specs: {
                              ceilingHeight: li.specs.ceilingHeight,
                              dockDoors: li.specs.dockDoors,
                              powerCapacity: li.specs.powerCapacity,
                              zoningType: li.specs.zoningType
                            }
                          });
                        }}
                      >
                        Edit
                      </button>

                      {/* View Details Button */}
                      <button
                        className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded"
                        onClick={() => navigate(`/listing/${li._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </InfoWindow>
                );
              })()}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Inline Edit Form */}
      {editingListing && (
        <form
          onSubmit={handleUpdate}
          className="border-t border-gray-200 p-4 bg-gray-50 space-y-4"
        >
          <h2 className="text-lg font-semibold mb-4">Edit Listing</h2>
          <div>
            <label className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              value={editingListing.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">City:</label>
            <input
              type="text"
              value={editingListing.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Latitude:</label>
              <input
                type="number"
                step="any"
                value={editingListing.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Longitude:</label>
              <input
                type="number"
                step="any"
                value={editingListing.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
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
                value={editingListing.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Square Footage:</label>
              <input
                type="number"
                step="any"
                value={editingListing.squareFootage}
                onChange={(e) => handleChange('squareFootage', e.target.value)}
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
                value={editingListing.specs.ceilingHeight}
                onChange={(e) =>
                  handleChange('specs', {
                    ...editingListing.specs,
                    ceilingHeight: e.target.value
                  })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Dock Doors (#):</label>
              <input
                type="number"
                value={editingListing.specs.dockDoors}
                onChange={(e) =>
                  handleChange('specs', {
                    ...editingListing.specs,
                    dockDoors: e.target.value
                  })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Power Capacity:</label>
            <input
              type="text"
              value={editingListing.specs.powerCapacity}
              onChange={(e) =>
                handleChange('specs', {
                  ...editingListing.specs,
                  powerCapacity: e.target.value
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Zoning Type:</label>
            <input
              type="text"
              value={editingListing.specs.zoningType}
              onChange={(e) =>
                handleChange('specs', {
                  ...editingListing.specs,
                  zoningType: e.target.value
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setEditingListing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MapSearch;
