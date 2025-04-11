import api from '../utils/axios';

const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getCampaignMetrics: async (campaignId) => {
    const response = await api.get(`/analytics/campaigns/${campaignId}`);
    return response.data;
  },

  getPostAnalytics: async (postId) => {
    const response = await api.get(`/analytics/posts/${postId}`);
    return response.data;
  },

  getPlatformStats: async () => {
    const response = await api.get('/analytics/platforms');
    return response.data;
  },

  getEngagementMetrics: async (params) => {
    const response = await api.get('/analytics/engagement', { params });
    return response.data;
  },

  exportAnalytics: async (dateRange, format = 'csv') => {
    const response = await api.get('/analytics/export', {
      params: { ...dateRange, format },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default analyticsService; 