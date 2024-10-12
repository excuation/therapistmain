const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who booked
    userName: { type: String, required: true }, // Logged-in user's name
    userEmail: { type: String, required: true }, // Logged-in user's email
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true }, // Reference to the Therapist
    doctorName: { type: String, required: true }, // Therapist's name (doctor's name)
    appointmentTime: { type: Date, required: true }, // Appointment time
    message: { type: String } // Optional message from the user
    ,location: { type: String, required: true },         // New field for location
    disease: { type: String, required: true }, 
});

module.exports = mongoose.model('Appointment', appointmentSchema);
