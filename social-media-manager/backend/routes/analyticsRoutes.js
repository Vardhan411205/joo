const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', auth, analyticsController.getDashboardStats);
router.get('/campaigns/:id', auth, analyticsController.getCampaignMetrics);
router.get('/posts/:id', auth, analyticsController.getPostAnalytics);

module.exports = router; 