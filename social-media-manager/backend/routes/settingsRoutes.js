const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const settingsController = require('../controllers/settingsController');

router.put('/profile', auth, settingsController.updateProfile);
router.put('/notifications', auth, settingsController.updateNotifications);
router.post('/social/connect', auth, settingsController.connectSocialAccount);
router.get('/social/accounts', auth, settingsController.getSocialAccounts);
router.put('/preferences', auth, settingsController.updatePreferences);
router.get('/preferences', auth, settingsController.getPreferences);
router.get('/notifications', auth, settingsController.getNotifications);

module.exports = router; 