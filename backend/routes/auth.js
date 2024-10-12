const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const History = require('../models/history');
 // Import the History model


// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure you have an 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save the file with the current timestamp
    }
});

const upload = multer({ storage: storage });
router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Sign Up Route
router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        return res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error in sign up:', err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    console.log('Login route hit');
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });
      

        return res.json({ token });
    } catch (err) {
        console.error('Error in login:', err.message);
        return res.status(500).send('Server error');
    }
});
// Protected Profile Route
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).send('Server error');
    }
});

// Profile Picture Upload
router.post('/upload-profile-picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.profilePicture = req.file.path; // Save the file path to the user's profile
        await user.save();
        res.json({ msg: 'Profile picture updated', profilePicture: req.file.path });
    } catch (err) {
        console.error('Error uploading profile picture:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
