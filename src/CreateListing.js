// src/CreateListing.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CreateListing() {
  const navigate = useNavigate();

  // Form state for each field
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [price, setPrice] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [ceilingHeight, setCeilingHeight] = useState("");
  const [dockDoors, setDockDoors] = useState("");
  const [powerCapacity, setPowerCapacity] = useState("");
  const [zoningType, setZoningType] = useState("");

  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    // Build the payload to match your back-end schema
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
        zoningType: zoningType.trim(),
      },
    };

    try {
      const res = await fetch("http://localhost:8000/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      // On success, navigate back to the list
      navigate("/");
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
        ← Back to Listings
      </Link>
      <h1 style={{ marginTop: 20 }}>Create New Listing</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 20 }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Name:<br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: 8, width: 300 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            City:<br />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              style={{ padding: 8, width: 300 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Latitude:<br />
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              step="any"
              style={{ padding: 8, width: 300 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Longitude:<br />
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              step="any"
              style={{ padding: 8, width: 300 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Price (USD):<br />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{ padding: 8, width: 300 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Square Footage:<br />
            <input
              type="number"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
              required
              style={{ padding: 8, width: 300 }}
            />
          </label>
        </div>

        <fieldset style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc" }}>
          <legend>Specs</legend>
          <div style={{ marginBottom: 10 }}>
            <label>
              Ceiling Height (ft):<br />
              <input
                type="number"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(e.target.value)}
                required
                style={{ padding: 8, width: 280 }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Dock Doors (#):<br />
              <input
                type="number"
                value={dockDoors}
                onChange={(e) => setDockDoors(e.target.value)}
                required
                style={{ padding: 8, width: 280 }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Power Capacity:<br />
              <input
                type="text"
                value={powerCapacity}
                onChange={(e) => setPowerCapacity(e.target.value)}
                required
                style={{ padding: 8, width: 280 }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>
              Zoning Type:<br />
              <input
                type="text"
                value={zoningType}
                onChange={(e) => setZoningType(e.target.value)}
                required
                style={{ padding: 8, width: 280 }}
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={creating}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: creating ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: creating ? "not-allowed" : "pointer",
          }}
        >
          {creating ? "Creating…" : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;

