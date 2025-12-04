// Percy Yarleque
const mongoose = require('mongoose');

const TicketTierSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        default: 'USD'
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    sold: {
        type: Number,
        default: 0,
        min: 0,
    },
    reserved: {
        type: Number,
        default: 0,
        min: 0,
    },
    max_per_order: {
        type: Number,
        default: 4,
    },
    sales_start: {
        type: Date,
        required: true,
    },
    sales_end: {
        type: Date,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    


}, {
  timestamps: true
});

module.exports = mongoose.model('TicketTier', TicketTierSchema);
