// Percy Yarleque
const mongoose = require('mongoose');
const OrderItemSchema = new mongoose.Schema({
    tierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TicketTier', 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unit_price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
    },

});
const OrderSchema = new mongoose.Schema({
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
  items: [OrderItemSchema],
  total_amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  payment_id: {
    type: String,
    default: null,
    trim: true
  },
  purchase_date: {
    type: Date,
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
