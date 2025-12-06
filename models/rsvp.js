// Caleb Beardall
const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    eventId: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ['Going', 'Not Going', 'Undecided']
    }
});

module.exports = mongoose.model('Rsvp', rsvpSchema);