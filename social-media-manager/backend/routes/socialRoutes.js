const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const socialMediaController = require('../controllers/socialMediaController');

// Get connected accounts
router.get('/accounts', auth, socialMediaController.getConnectedAccounts);

// Connect social account
router.post('/connect/:platform', auth, socialMediaController.connectAccount);

// Disconnect social account
router.post('/disconnect/:platform', auth, socialMediaController.disconnectAccount);

// Social media auth callbacks
router.get('/auth/facebook/callback', socialMediaController.facebookCallback);
router.get('/auth/twitter/callback', socialMediaController.twitterCallback);

// Add this route
router.get('/oauth/:platform', auth, socialMediaController.initiateOAuth);

module.exports = router; 