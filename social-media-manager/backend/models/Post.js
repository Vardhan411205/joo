const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  platforms: [{
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin'],
    required: true
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'posted', 'failed'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  analytics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    reach: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Post', postSchema);