import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ListingList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/listings")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading listings…</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: "red" }}>
        Failed to load listings: {error}
      </div>
    );

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* ────── ADD “Create Listing” LINK ────── */}
      <div style={{ marginBottom: 20 }}>
        <Link
          to="/create"
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          + Create New Listing
        </Link>
      </div>

      <h1>Industrial Listings</h1>

      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {listings.map((listing) => (
            <li
              key={listing._id}
              style={{
                marginBottom: 20,
                padding: 15,
                border: "1px solid #ccc",
                borderRadius: 8,
              }}
            >
              <Link
                to={`/listings/${listing._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h2 style={{ margin: "0 0 5px" }}>{listing.name}</h2>
              </Link>
              <p style={{ margin: "0 0 5px" }}>
                <strong>City:</strong> {listing.city}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListingList;

