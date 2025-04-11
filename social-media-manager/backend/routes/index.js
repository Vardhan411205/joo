const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const mediaRoutes = require('./mediaRoutes');
const postRoutes = require('./postRoutes');
const campaignRoutes = require('./campaignRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const socialRoutes = require('./socialRoutes');
const settingsRoutes = require('./settingsRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/posts', postRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/social', socialRoutes);
router.use('/settings', settingsRoutes);

module.exports = router; 