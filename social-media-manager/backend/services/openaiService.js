const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateSocialMediaContent = async (topic, platform, tone) => {
  try {
    const prompt = `Write a ${tone.toLowerCase()} social media post for ${platform} about ${topic}. 
    The post should be engaging and optimized for ${platform}'s format. 
    Include relevant hashtags if appropriate.`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional social media manager who creates engaging content for ${platform}.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content');
  }
};

module.exports = {
  generateSocialMediaContent
}; 