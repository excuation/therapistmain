// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Use dotenv for environment variables
const cookieParser = require('cookie-parser');
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend's origin
    credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
// MongoDB Connection (use environment variables for security)
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes



const authRoutes = require('./routes/auth'); // Ensure this path is correct

app.use('/api', authRoutes); // All routes prefixed with '/api'
const searchRoutes = require('./routes/search'); // Ensure this path is correct
app.use('/api', searchRoutes); // Add this line to use the search routes
// server.js (continued)
const appointmentRoutes = require('./routes/appointments');

app.use('/api/appointments', appointmentRoutes); // Add this line to use the appointments routes
// Catch-all for undefined routes (404 handler)
const therapistRoutes = require('./routes/therapists');
app.use('/api', therapistRoutes);  // Ensure the route is registered
const historyRoutes = require('./routes/history'); // Adjust the path as necessary
app.use('/api/history', historyRoutes); // Set the prefix for the history routes
app.use('/api/users', authRoutes); 
app.use('/api', require('./routes/ticket'));

app.use((req, res) => {
    res.status(404).json({ msg: '404 Not Found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));