const axios = require('axios');
require('dotenv').config();

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async generateContent({ platform, topic, tone }) {
    try {
      const prompt = `Create an engaging ${platform} post about ${topic}. 
        The tone should be ${tone}. 
        Make it attention-grabbing and optimized for ${platform}'s format.`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional social media manager skilled in creating engaging content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content.trim()
      };
    } catch (error) {
      console.error('Error generating content:', error);
      return {
        success: false,
        error: 'Failed to generate content'
      };
    }
  }

  async generateCampaignIdeas({ industry, target_audience, goals }) {
    try {
      const prompt = `Generate 3 creative social media campaign ideas for a ${industry} business.
        Target audience: ${target_audience}
        Campaign goals: ${goals}
        For each idea, include:
        - Campaign name
        - Key message
        - Content themes
        - Suggested platforms
        - Potential hashtags`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert social media strategist who creates innovative campaign ideas.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        ideas: response.data.choices[0].message.content.trim()
      };
    } catch (error) {
      console.error('Error generating campaign ideas:', error);
      return {
        success: false,
        error: 'Failed to generate campaign ideas'
      };
    }
  }
}

module.exports = new AIService();