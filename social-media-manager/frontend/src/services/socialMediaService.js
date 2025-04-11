import api from '../utils/axios';

const socialMediaService = {
  connectFacebook: async () => {
    try {
      const response = await api.post('/social/connect/facebook');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  connectTwitter: async () => {
    try {
      const response = await api.post('/social/connect/twitter');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  connectInstagram: async () => {
    try {
      const response = await api.post('/social/connect/instagram');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConnectedAccounts: async () => {
    try {
      const response = await api.get('/social/accounts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  disconnectAccount: async (platform) => {
    try {
      const response = await api.post(`/social/disconnect/${platform}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  initiateOAuth: async (platform) => {
    const response = await api.get(`/social/${platform}/auth`);
    window.location.href = response.data.authUrl;
  },

  handleOAuthCallback: async (platform, params) => {
    try {
      const response = await api.post(`/social/auth/${platform}/callback`, params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  disconnectPlatform: async (platform) => {
    const response = await api.delete(`/social/${platform}/disconnect`);
    return response.data;
  },

  getConnectedPlatforms: async () => {
    const response = await api.get('/social/connected');
    return response.data;
  },

  publishToPlatform: async (postId, platform) => {
    const response = await api.post(`/social/${platform}/publish/${postId}`);
    return response.data;
  },

  getPlatformMetrics: async (platform) => {
    const response = await api.get(`/social/${platform}/metrics`);
    return response.data;
  },

  updatePlatformSettings: async (platform, settings) => {
    const response = await api.put(`/social/${platform}/settings`, settings);
    return response.data;
  }
};

export default socialMediaService; 