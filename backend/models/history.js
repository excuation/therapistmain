const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'theripest', required: true }, // Save therapist ID
    therapistName: { type: String, required: true }, // Save therapist name
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('History', historySchema);
