const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  connectPlatform,
  disconnectPlatform,
  getConnectedPlatforms
} = require('../controllers/socialController');

router.use(protect);

// Get platform connection status
router.get('/platforms', getConnectedPlatforms);

// Connect social media platforms
router.post('/connect', connectPlatform);
router.delete('/disconnect/:platform', disconnectPlatform);

// Add your social media integration routes here
router.get('/accounts', (req, res) => {
  res.json({ message: 'Social accounts route working' });
});

module.exports = router; 