// server.js

// 1. Load environment variables from .env
require('dotenv').config();

// 2. Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 3. Import models
const Listing = require('./models/Listing');
const User = require('./models/User');

// 4. Create an Express app instance
const app = express();

// 5. Load JWT secret from environment or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// 6. Enable CORS for all routes
app.use(cors());

// 7. Use middleware to parse JSON bodies
app.use(express.json());

// 8. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pheafer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 9. Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// 10. Auth routes

// 10.1 POST /api/register
//      Body: { email, password, role }
app.post('/api/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    // Check if user already exists
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role && ['tenant', 'developer'].includes(role) ? role : 'tenant'
    });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 10.2 POST /api/login
//      Body: { email, password }
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Create JWT (include role in payload if desired)
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 11. Listing routes

// 11.1 GET /api/listings  (public)
app.get('/api/listings', async (req, res) => {
  try {
    const cityQuery = (req.query.city || '').trim();
    let listings;
    if (cityQuery) {
      listings = await Listing.find({
        city: { $regex: cityQuery, $options: 'i' }
      });
    } else {
      listings = await Listing.find();
    }
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 11.2 GET /api/listings/:id  (public)
app.get('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate('createdBy', 'email role');
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 11.3 POST /api/listings  (protected)
app.post('/api/listings', authenticate, async (req, res) => {
  const {
    name,
    city,
    latitude,
    longitude,
    price,
    squareFootage,
    specs
  } = req.body;

  // Validate all fields including specs
  if (
    !name ||
    !city ||
    latitude == null ||
    longitude == null ||
    price == null ||
    squareFootage == null ||
    !specs ||
    specs.ceilingHeight == null ||
    specs.dockDoors == null ||
    !specs.powerCapacity ||
    !specs.zoningType
  ) {
    return res.status(400).json({ error: 'All fields—including specs—are required.' });
  }

  try {
    const newListing = new Listing({
      name: name.trim(),
      city: city.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      price: Number(price),
      squareFootage: Number(squareFootage),
      specs: {
        ceilingHeight: Number(specs.ceilingHeight),
        dockDoors: Number(specs.dockDoors),
        powerCapacity: specs.powerCapacity.trim(),
        zoningType: specs.zoningType.trim()
      },
      createdBy: req.userId
    });
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 11.4 PUT /api/listings/:id  (protected)
app.put('/api/listings/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    city,
    latitude,
    longitude,
    price,
    squareFootage,
    specs
  } = req.body;

  if (
    !name ||
    !city ||
    latitude == null ||
    longitude == null ||
    price == null ||
    squareFootage == null ||
    !specs ||
    specs.ceilingHeight == null ||
    specs.dockDoors == null ||
    !specs.powerCapacity ||
    !specs.zoningType
  ) {
    return res.status(400).json({ error: 'All fields—including specs—are required.' });
  }

  try {
    const updated = await Listing.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        city: city.trim(),
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
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 11.5 DELETE /api/listings/:id  (protected)
app.delete('/api/listings/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 12. Health–check route
app.get('/', (req, res) => {
  res.send('Pheafer Backend is Running');
});

// 13. Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Pheafer backend listening at http://localhost:${PORT}`);
});
