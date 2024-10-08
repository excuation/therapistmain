// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    doctorName: { type: String, required: true },
    appointmentTime: { type: Date, required: true },
    message: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);