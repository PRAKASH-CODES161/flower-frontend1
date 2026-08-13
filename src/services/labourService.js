import api from './api';

export const labourService = {
  getAll: async () => {
    const response = await api.get('/labour');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/labour/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/labour', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/labour/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/labour/${id}`);
    return response.data;
  }
};
