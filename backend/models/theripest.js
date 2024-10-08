// models/theripest.js
const mongoose = require('mongoose');

// Define the theripest schema
const theripestSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the doctor or service
    description: { type: String, required: true }, // Description of the doctor or service
    doctorDetails: {
        name: { type: String, required: true }, // Doctor's name
        specialization: { type: String }, // Doctor's specialization
        experience: { type: Number } // Doctor's years of experience
    }
});

// Export the model based on the schema
module.exports = mongoose.model('theripest', theripestSchema);