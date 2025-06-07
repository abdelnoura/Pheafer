import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading listing…</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: "red" }}>Error: {error}</div>
    );
  if (!listing) return <div style={{ padding: 20 }}>Listing not found.</div>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
        ← Back to Listings
      </Link>
      <h1 style={{ marginTop: 20 }}>{listing.name}</h1>
      <p>
        <strong>City:</strong> {listing.city}
      </p>
      <p>
        <strong>Latitude:</strong> {listing.latitude}
      </p>
      <p>
        <strong>Longitude:</strong> {listing.longitude}
      </p>
      <p>
        <strong>Specs:</strong>
      </p>
      <ul>
        <li>Ceiling Height: {listing.specs.ceilingHeight}’</li>
        <li>Dock Doors: {listing.specs.dockDoors}</li>
        <li>Power Capacity: {listing.specs.powerCapacity}</li>
        <li>Zoning Type: {listing.specs.zoningType}</li>
      </ul>
      <p>
        <strong>Square Footage:</strong>{" "}
        {listing.squareFootage.toLocaleString()} SF
      </p>
      <p>
        <strong>Price:</strong> ${listing.price.toLocaleString()}
      </p>
    </div>
  );
}

export default ListingDetail;

