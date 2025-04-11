import api from '../utils/axios';

const settingsService = {
  getPreferences: async () => {
    const response = await api.get('/settings/preferences');
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/settings/preferences', preferences);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/settings/notifications');
    return response.data;
  },

  updateNotifications: async (settings) => {
    const response = await api.put('/settings/notifications', settings);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/settings/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/settings/password', passwordData);
    return response.data;
  },

  exportUserData: async () => {
    const response = await api.get('/settings/export', {
      responseType: 'blob'
    });
    return response.data;
  },

  connectSocialAccount: async (platform, data) => {
    const response = await api.post('/settings/social/connect', {
      platform,
      ...data
    });
    return response.data;
  },

  getSocialAccounts: async () => {
    const response = await api.get('/settings/social/accounts');
    return response.data;
  }
};

export default settingsService; 