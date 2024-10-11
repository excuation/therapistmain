const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    console.log(token);


    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
        
        // Find the user by ID and select necessary fields like email
        const user = await User.findById(decoded.user.id).select('name email'); // Fetching only name and email

        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        // Attach user to request object (with selected fields)
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
