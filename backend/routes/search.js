// routes/search.js
const express = require('express');
const router = express.Router();
const Theripest = require('../models/theripest.js'); // Import your Theripest model

// Search route to get therapist data based on query
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const results = await Theripest.find({ name: { $regex: query, $options: 'i' } });
        res.set('Cache-Control', 'no-store'); // Prevent caching
        console.log("Search results:", results);
        res.json(results);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: 'Error fetching data', error });
    }
});


module.exports = router;
