const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Mock content generator function
const generateMockContent = (topic, tone, platforms) => {
  const hashtags = {
    twitter: ['#SocialMedia', '#DigitalMarketing', '#ContentCreation'],
    facebook: ['#SocialMediaMarketing', '#Business', '#Engagement'],
    instagram: ['#InstaPost', '#SocialStrategy', '#ContentCreator'],
    linkedin: ['#ProfessionalNetwork', '#BusinessGrowth', '#Marketing']
  };

  const toneTemplates = {
    'Humorous': [
      "😂 Can't stop laughing about {topic}! Who else relates?",
      "When {topic} meets humor, magic happens! 🎭",
      "Plot twist: {topic} just got hilarious! 🤣"
    ],
    'Professional': [
      "Exploring the latest developments in {topic}.",
      "Industry insights: Understanding {topic} in today's market.",
      "Key takeaways from {topic} that every professional should know."
    ],
    'Casual': [
      "Hey folks! Let's talk about {topic} ✨",
      "Just thinking about {topic} today... what's your take?",
      "Anyone else excited about {topic}? Let's discuss!"
    ],
    'Informative': [
      "Did you know? Here's what makes {topic} so interesting...",
      "5 fascinating facts about {topic} you might not know!",
      "Breaking down {topic}: Everything you need to know"
    ],
    'Promotional': [
      "Transform your approach to {topic} with our expert tips!",
      "Don't miss out on these {topic} insights!",
      "Ready to master {topic}? Here's how!"
    ],
    'Engaging': [
      "What's your experience with {topic}? Share below! 👇",
      "Let's start a conversation about {topic}!",
      "Your thoughts on {topic}? We'd love to hear!"
    ]
  };

  // Get random template for the selected tone
  const templates = toneTemplates[tone] || toneTemplates['Casual'];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Replace {topic} with actual topic
  let content = template.replace('{topic}', topic);

  // Add platform-specific hashtags
  const selectedHashtags = platforms.map(platform => 
    hashtags[platform][Math.floor(Math.random() * hashtags[platform].length)]
  );

  content += '\n\n' + selectedHashtags.join(' ');

  return content;
};

// Generate content endpoint
router.post('/generate-content', async (req, res) => {
  try {
    const { topic, tone, platforms } = req.body;

    if (!topic || !tone || !platforms || platforms.length === 0) {
      return res.status(400).json({ 
        message: 'Please provide topic, tone, and at least one platform' 
      });
    }

    console.log('Generating content for:', { topic, tone, platforms });

    // Generate mock content
    const generatedContent = generateMockContent(topic, tone, platforms);
    
    console.log('Generated content:', generatedContent);
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ message: 'Failed to generate content. Please try again.' });
  }
});

// Schedule a post
router.post('/schedule-post', async (req, res) => {
  try {
    const { content, platforms, scheduledDate, topic } = req.body;

    const post = new Post({
      content,
      platforms,
      scheduledDate: new Date(scheduledDate),
      topic,
      status: 'scheduled'
    });

    await post.save();
    
    res.json({ message: 'Post scheduled successfully', post });
  } catch (error) {
    console.error('Post scheduling error:', error);
    res.status(500).json({ message: 'Failed to schedule post' });
  }
});

// Get scheduled posts
router.get('/scheduled-posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'scheduled' })
      .sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    res.status(500).json({ message: 'Failed to fetch scheduled posts' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { platform, timeRange } = req.query;
    
    const mockData = {
      overview: {
        totalFollowers: Math.floor(Math.random() * 10000),
        totalEngagement: Math.floor(Math.random() * 5000),
        totalReach: Math.floor(Math.random() * 20000),
        totalPosts: Math.floor(Math.random() * 100)
      },
      platforms: {
        facebook: {
          followers: Math.floor(Math.random() * 5000),
          engagement: Math.floor(Math.random() * 2000),
          reach: Math.floor(Math.random() * 10000),
          posts: Math.floor(Math.random() * 50)
        },
        twitter: {
          followers: Math.floor(Math.random() * 3000),
          engagement: Math.floor(Math.random() * 1500),
          reach: Math.floor(Math.random() * 8000),
          posts: Math.floor(Math.random() * 30)
        },
        instagram: {
          followers: Math.floor(Math.random() * 4000),
          engagement: Math.floor(Math.random() * 2500),
          reach: Math.floor(Math.random() * 12000),
          posts: Math.floor(Math.random() * 40)
        }
      },
      engagementTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 100)
      })),
      reachTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reach: Math.floor(Math.random() * 5000)
      })),
      followersTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followers: Math.floor(Math.random() * 100) + 1000
      }))
    };

    res.json(mockData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

module.exports = router;