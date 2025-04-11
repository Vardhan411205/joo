import api from '../utils/axios';

const schedulerService = {
  schedulePost: async (postId, scheduleData) => {
    const response = await api.post(`/scheduler/posts/${postId}`, scheduleData);
    return response.data;
  },

  getScheduledPosts: async () => {
    const response = await api.get('/scheduler/posts');
    return response.data;
  },

  updateSchedule: async (postId, scheduleData) => {
    const response = await api.put(`/scheduler/posts/${postId}`, scheduleData);
    return response.data;
  },

  cancelSchedule: async (postId) => {
    const response = await api.delete(`/scheduler/posts/${postId}`);
    return response.data;
  },

  getBestTimes: async (platform) => {
    const response = await api.get(`/scheduler/best-times/${platform}`);
    return response.data;
  },

  getScheduleConflicts: async (scheduleData) => {
    const response = await api.post('/scheduler/check-conflicts', scheduleData);
    return response.data;
  }
};

export default schedulerService; 