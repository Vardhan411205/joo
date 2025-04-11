import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const aiService = {
  generateContent: async (prompt) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate`, { prompt });
      return response.data.content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  },

  improveContent: async (content, platform) => {
    try {
      const response = await axios.post(`${API_URL}/ai/improve`, { content, platform });
      return response.data.improvedContent;
    } catch (error) {
      console.error('Error improving content:', error);
      throw error;
    }
  },

  analyzeSentiment: async (content) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze`, { content });
      return response.data.analysis;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw error;
    }
  },

  generatePost: async (data) => {
    const response = await axios.post('/ai/generate/post', data);
    return response.data;
  },

  generateHashtags: async (content) => {
    const response = await axios.post('/ai/generate/hashtags', { content });
    return response.data;
  },

  optimizeContent: async (content, platform) => {
    const response = await axios.post('/ai/optimize', { content, platform });
    return response.data;
  },

  getSuggestions: async (postId) => {
    const response = await axios.get(`/ai/suggestions/${postId}`);
    return response.data;
  },

  analyzePerformance: async (postId) => {
    const response = await axios.get(`/ai/analyze/${postId}`);
    return response.data;
  }
};

export default aiService; 