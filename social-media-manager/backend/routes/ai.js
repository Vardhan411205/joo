const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const AIService = require('../services/aiService');

router.use(protect);

router.post('/generate', async (req, res) => {
  try {
    const { prompt, platform, tone } = req.body;
    const content = await AIService.generateContent(prompt, platform, tone);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: 'Error generating content' });
  }
});

module.exports = router; 