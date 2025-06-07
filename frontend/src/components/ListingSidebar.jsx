// src/components/ListingSidebar.jsx

import React from 'react';

function ListingSidebar({ listings, onSelect }) {
  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <h2 className="text-xl font-semibold p-4">All Listings</h2>
      <ul>
        {listings.map((li) => (
          <li
            key={li._id}
            onClick={() => onSelect(li)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b border-gray-100"
          >
            <p className="font-medium">{li.name}</p>
            <p className="text-sm text-gray-600">{li.city}</p>
          </li>
        ))}
        {listings.length === 0 && (
          <li className="px-4 py-2 text-gray-500">No listings available</li>
        )}
      </ul>
    </div>
  );
}

export default ListingSidebar;

