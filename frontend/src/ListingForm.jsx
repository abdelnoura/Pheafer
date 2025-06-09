// src/ListingForm.jsx
import React from 'react';

export default function ListingForm() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary-700 mb-4">Create / Edit Listing</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Warehouse Name"
            className="mt-1 block w-full border-gray-300 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
