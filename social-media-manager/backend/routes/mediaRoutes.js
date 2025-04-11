const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { auth } = require('../middleware/authMiddleware');

// Protected routes - all routes require authentication
router.use(auth);

// Media routes
router.post('/upload', mediaController.uploadMedia);
router.get('/all', mediaController.getAllMedia);
router.delete('/:id', mediaController.deleteMedia);
router.put('/:id', mediaController.updateMedia);

module.exports = router; 