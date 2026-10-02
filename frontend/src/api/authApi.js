import apiClient from './client';

export const authApi = {
  async login({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch {
      // Mock fallback authentication
      const mockUser = {
        id: 'usr-101',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        token: 'mock-jwt-token-' + Date.now(),
      };
      return { user: mockUser, token: mockUser.token };
    }
  },

  async register({ name, email, password, phone }) {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password, phone });
      return response.data;
    } catch {
      const mockUser = {
        id: 'usr-' + Math.floor(Math.random() * 1000),
        name,
        email,
        phone,
        token: 'mock-jwt-token-' + Date.now(),
      };
      return { user: mockUser, token: mockUser.token };
    }
  },

  async getProfile() {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch {
      const savedUser = localStorage.getItem('snitch_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
  },
};
