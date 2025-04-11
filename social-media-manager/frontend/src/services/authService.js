import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Add auth token to all requests if it exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      // Clear auth data on 401 errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }
    try {
      const response = await axios.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin functions
  getAllUsers: async () => {
    try {
      const response = await axios.get('/admin/users');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axios.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      const response = await axios.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
};

export default authService; 