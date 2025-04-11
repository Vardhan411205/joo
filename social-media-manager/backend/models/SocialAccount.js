const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin']
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  platformUserId: {
    type: String
  },
  platformUsername: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema); 