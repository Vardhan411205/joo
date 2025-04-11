const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MediaUploader = require('../services/mediaUploader');

router.get('/', protect, async (req, res) => {
  try {
    const media = await Media.find({ user: req.user._id });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 