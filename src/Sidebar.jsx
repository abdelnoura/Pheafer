// src/Sidebar.jsx
import React from 'react';

export default function Sidebar() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary-700 mb-4">Listings</h2>
      {/* Replace these dummy items with your real listing data later */}
      <ul>
        <li className="pb-2 border-b">Listing #1</li>
        <li className="pb-2 border-b">Listing #2</li>
        <li className="pb-2 border-b">Listing #3</li>
      </ul>
    </div>
  );
}
