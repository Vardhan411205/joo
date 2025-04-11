const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');
const OpenAI = require('openai');
const Campaign = require('../models/Campaign');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI routes
router.post('/generate-post', auth, async (req, res) => {
  try {
    const { platform, campaignId } = req.body;

    // Get campaign details for context
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Make sure user owns campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Create prompt based on campaign details and platform
    const messages = [
      {
        role: 'system',
        content: 'You are a professional social media manager skilled in creating engaging content.'
      },
      {
        role: 'user',
        content: `Generate an engaging social media post for ${platform} that:
1. Promotes: ${campaign.name}
2. Targets: ${campaign.targetAudience}
3. Aligns with these goals: ${campaign.goals}
4. Maintains a professional yet engaging tone
5. Includes relevant hashtags if appropriate
6. Respects ${platform}'s best practices and character limits
7. Encourages user engagement`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 200,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content.trim();
    res.json({ content: generatedContent });
  } catch (err) {
    console.error('AI Generation Error:', err);
    res.status(500).json({ message: 'Failed to generate content' });
  }
});

router.post('/generate-hashtags', auth, aiController.generateHashtags);

// Generate content using ChatGPT
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional social media manager skilled in creating engaging content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Error generating content' });
  }
});

// Improve existing content
router.post('/improve', auth, async (req, res) => {
  try {
    const { content, platform } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional social media manager skilled in creating engaging content.',
        },
        {
          role: 'user',
          content: `Improve this ${platform} post while maintaining its core message: ${content}`,
        },
      ],
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error improving content:', error);
    res.status(500).json({ message: 'Error improving content' });
  }
});

// Analyze content sentiment and engagement potential
router.post('/analyze', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a social media analytics expert who can evaluate content effectiveness.',
        },
        {
          role: 'user',
          content: `Analyze this social media post and provide feedback on its potential engagement, sentiment, and suggestions for improvement: ${content}`,
        },
      ],
    });

    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error analyzing content:', error);
    res.status(500).json({ message: 'Error analyzing content' });
  }
});

module.exports = router; 