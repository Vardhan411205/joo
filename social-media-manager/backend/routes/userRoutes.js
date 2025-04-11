const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateNotifications,
  updateAvatar,
  getActivityHistory
} = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/notifications', protect, updateNotifications);
router.post('/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/activity', protect, getActivityHistory);

module.exports = router; 