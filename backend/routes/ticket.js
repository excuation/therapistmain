const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket'); // Adjust the import based on your file structure
const authMiddleware = require('../middleware/authMiddleware');

// Route to get ticket by ID
const mongoose = require('mongoose');

router.get('/', authMiddleware, async (req, res) => {
  try {
    // Fetch ticket data based on userId and populate therapistName
    const tickets = await Ticket.find({ userId: req.user._id });
    console.log(tickets);
    res.json(tickets); // Respond with the tickets array for the logged-in user
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});


module.exports = router;
