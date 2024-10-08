// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Use dotenv for environment variables

const authRoutes = require('./routes/auth'); // Ensure this path is correct

const app = express();
app.use('/uploads', express.static('uploads'));



// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection (use environment variables for security)
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', authRoutes); // All routes prefixed with '/api'
const searchRoutes = require('./routes/search'); // Ensure this path is correct
app.use('/api', searchRoutes); // Add this line to use the search routes
// server.js (continued)
const appointmentRoutes = require('./routes/appointments');

app.use('/api/appointments', appointmentRoutes); // Add this line to use the appointments routes
// Catch-all for undefined routes (404 handler)
const therapistRoutes = require('./routes/therapists');
app.use('/api', therapistRoutes);  // Ensure the route is registered

app.use((req, res) => {
    res.status(404).json({ msg: '404 Not Found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
