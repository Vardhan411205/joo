import api from './api';

const postService = {
  getPosts: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  updatePost: async (id, data) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  generateContent: async (data) => {
    const response = await api.post('/posts/generate', data);
    return response.data;
  },

  schedulePost: async (id, scheduleData) => {
    const response = await api.post(`/posts/${id}/schedule`, scheduleData);
    return response.data;
  },

  cancelScheduledPost: async (id) => {
    const response = await api.post(`/posts/${id}/cancel-schedule`);
    return response.data;
  }
};

export default postService; 