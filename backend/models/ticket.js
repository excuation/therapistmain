const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // You may want to store it as a string or date
    therapistName: { type: String, required: true },
    userName: { type: String, required: true },
     therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'theripest', },
    location: { type: String, required: true },
    disease: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // New field for user ID
});

module.exports = mongoose.model('Ticket', ticketSchema);
