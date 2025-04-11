import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const campaignService = {
  getCampaigns: async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  getCampaign: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await axios.post(`${API_URL}/campaigns`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  updateCampaign: async (id, campaignData) => {
    try {
      const response = await axios.put(`${API_URL}/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  deleteCampaign: async (id) => {
    try {
      await axios.delete(`${API_URL}/campaigns/${id}`);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  getCampaignMetrics: async (id) => {
    const response = await axios.get(`${API_URL}/campaigns/${id}/metrics`);
    return response.data;
  },

  scheduleCampaign: async (id, scheduleData) => {
    const response = await axios.post(`${API_URL}/campaigns/${id}/schedule`, scheduleData);
    return response.data;
  },

  pauseCampaign: async (id) => {
    const response = await axios.post(`${API_URL}/campaigns/${id}/pause`);
    return response.data;
  },

  resumeCampaign: async (id) => {
    const response = await axios.post(`${API_URL}/campaigns/${id}/resume`);
    return response.data;
  },

  generateAIContent: async (campaignId, prompt) => {
    const response = await axios.post(`${API_URL}/campaigns/${campaignId}/generate`, { prompt });
    return response.data;
  },

  schedulePosts: async (campaignId, posts) => {
    try {
      const response = await axios.post(`${API_URL}/campaigns/${campaignId}/schedule`, { posts });
      return response.data;
    } catch (error) {
      console.error('Error scheduling posts:', error);
      throw error;
    }
  },

  getCampaignAnalytics: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/campaigns/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
  },
};

export default campaignService; 