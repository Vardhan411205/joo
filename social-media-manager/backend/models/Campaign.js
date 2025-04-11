const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin'],
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'posted', 'failed'],
    default: 'scheduled',
  },
  analytics: {
    impressions: { type: Number, default: 0 },
    engagements: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
});

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  goals: {
    type: String,
    required: [true, 'Campaign goals are required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  platforms: [{
    type: String,
    enum: ['Facebook', 'Twitter', 'Instagram'],
    required: true
  }],
  targetAudience: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft',
  },
  scheduledPosts: [postSchema],
  analytics: {
    totalImpressions: { type: Number, default: 0 },
    totalEngagements: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Validate end date is after start date
campaignSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  const now = new Date();
  if (now < this.startDate) {
    this.status = 'draft';
  } else if (now > this.endDate) {
    this.status = 'completed';
  } else {
    this.status = 'active';
  }
  next();
});

// Method to calculate campaign analytics
campaignSchema.methods.calculateAnalytics = function() {
  const analytics = {
    totalImpressions: 0,
    totalEngagements: 0,
    totalClicks: 0,
    totalShares: 0,
    engagementRate: 0,
  };

  this.scheduledPosts.forEach(post => {
    analytics.totalImpressions += post.analytics.impressions;
    analytics.totalEngagements += post.analytics.engagements;
    analytics.totalClicks += post.analytics.clicks;
    analytics.totalShares += post.analytics.shares;
  });

  if (analytics.totalImpressions > 0) {
    analytics.engagementRate = (analytics.totalEngagements / analytics.totalImpressions) * 100;
  }

  this.analytics = analytics;
  return analytics;
};

module.exports = mongoose.model('Campaign', campaignSchema); 