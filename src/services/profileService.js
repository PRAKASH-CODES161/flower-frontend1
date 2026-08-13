import api from './api';

export const profileService = {
  getAll: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  create: async (profile) => {
    const response = await api.post('/profile', profile);
    return response.data;
  },
  update: async (id, profile) => {
    const response = await api.put(`/profile/${id}`, profile);
    return response.data;
  }
};
