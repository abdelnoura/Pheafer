// src/pages/ListingDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load listing');
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div className="p-4">
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
  );
}

export default ListingDetails;

