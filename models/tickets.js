// Percy Yarleque
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  holder_info: {
    name: {
      type: String,
      required: true,
        trim: true
    },
    email: {
      type: String,
        required: true,
        trim: true
    },
    identification_number: {
        type: String, 
        required: true,
        trim: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'used'],
    default: 'active'
  },
  qr_hash: {
    type: String,
    required: true,
    unique: true
  },
  checking_history: {
    scanned_at: {
        type: Date,
        default: null,
    },
    gate: {
        type: String,
        default: null,
        trim: true
    },
    staff_id: {
        type: String,
        default: null,
        trim: true
    }

  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
