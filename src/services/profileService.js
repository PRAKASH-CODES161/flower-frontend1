import api from './api';

export const profileService = {
  getAll: async () => {
    const response = await api.get('/profiles');
    return response.data;
  },
  create: async (profile) => {
    const response = await api.post('/profiles', profile);
    return response.data;
  },
  update: async (id, profile) => {
    const response = await api.put(`/profiles/${id}`, profile);
    return response.data;
  }
};
