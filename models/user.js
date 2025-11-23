const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      index: true,
    },
    avatar: {
      type: String,
    },
    // add roles here
    // role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    timestamps: true, // adds a createdAt and an updatedAt automatically each time
  }
);

module.exports = mongoose.model('User', userSchema);
