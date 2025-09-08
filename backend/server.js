const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Set default environment variables only if not already set by .env
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/labour-net';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'labour-net-secret-key-2024';
process.env.PORT = process.env.PORT || '5000';

const app = express();

// CORS: allow local dev origins
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Serve uploads statically for debugging (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const applicationRoutes = require('./routes/application');
const nidRoutes = require('./routes/nid');
const notificationRoutes = require('./routes/notification');
const messageRoutes = require('./routes/message');
const reviewRoutes = require('./routes/review');
const shiftRoutes = require('./routes/shift');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/nid', nidRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shifts', shiftRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database URL:', process.env.MONGO_URI);
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Attempting to connect to:', process.env.MONGO_URI);
  });