// models/Property.js
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number },          // New field for listing price
    size: { type: Number },
    clearHeight: { type: Number },
    loadingDocks: { type: Number },
    description: { type: String },
    latitude: { type: Number },         // For mapping
    longitude: { type: Number }         // For mapping
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', PropertySchema);
