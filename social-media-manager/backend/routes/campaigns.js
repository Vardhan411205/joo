const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');

// Base route: /api/campaigns
router.route('/')
  .get(protect, getCampaigns)
  .post(protect, createCampaign);

router.route('/:id')
  .get(protect, getCampaign)
  .put(protect, updateCampaign)
  .delete(protect, deleteCampaign);

module.exports = router; 