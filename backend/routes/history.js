const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const History = require('../models/history'); // Ensure this path is correct
const router = express.Router();

// Route to get user's history
router.get('/', authMiddleware, async (req, res) => {
    try {
        const histories = await History.find({ userId: req.user._id }).populate('therapistId'); // Fetch history based on user ID
        console.log(histories);
        res.json(histories);
    } catch (error) {
        console.error('Error fetching history:', error); // Log the error for debugging
        res.status(500).json({ msg: 'Server error', error });
    }
});

module.exports = router;