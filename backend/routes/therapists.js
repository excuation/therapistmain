const express = require('express');
const router = express.Router();
const Therapist = require('../models/theripest'); // Adjust the path as necessary

// Route to get therapist details by ID
router.get('/therapists/:id', async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.params.id);  // Fetch therapist by ID
        if (!therapist) return res.status(404).json({ message: 'Therapist not found' });
        res.json(therapist);  // Send therapist details
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
