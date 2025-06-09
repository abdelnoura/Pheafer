// models/Listing.js

const mongoose = require('mongoose');

// Define a sub‐schema for detailed specifications
const specsSchema = new mongoose.Schema({
  ceilingHeight: {
    type: Number,
    required: true
  },
  dockDoors: {
    type: Number,
    required: true
  },
  powerCapacity: {
    type: String,
    required: true,
    trim: true
  },
  zoningType: {
    type: String,
    required: true,
    trim: true
  }
});

// Main Listing schema
const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  squareFootage: {
    type: Number,
    required: true
  },
  specs: {
    type: specsSchema,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Listing', listingSchema);

