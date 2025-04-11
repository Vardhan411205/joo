const AIService = require('../services/aiService');

const aiController = {
  generatePost: async (req, res) => {
    try {
      const { prompt, tone, platform } = req.body;
      const content = await AIService.generatePost(prompt, tone, platform);
      res.json({ content });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ message: 'Error generating content' });
    }
  },

  generateHashtags: async (req, res) => {
    try {
      const { content, platform } = req.body;
      const hashtags = await AIService.suggestHashtags(content, platform);
      res.json({ hashtags });
    } catch (error) {
      console.error('Hashtag generation error:', error);
      res.status(500).json({ message: 'Error generating hashtags' });
    }
  }
};

module.exports = aiController; 