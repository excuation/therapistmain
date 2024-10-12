// models/Therapist.js
const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    doctorDetails: {
        name: { type: String, required: true },
        specialization: { type: String, required: true },
        yearsOfExperience: { type: Number, required: true }
    },
    // Add any other fields you need
});

const Therapist = mongoose.model('theripest', TherapistSchema);
module.exports = Therapist;
