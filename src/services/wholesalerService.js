import api from './api';

export const wholesalerService = {
  getAll: async () => {
    const response = await api.get('/wholesalers');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/wholesalers/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/wholesalers', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/wholesalers/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/wholesalers/${id}`);
    return response.data;
  }
};
