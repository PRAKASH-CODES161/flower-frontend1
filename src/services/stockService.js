import api from './api';

export const stockService = {
  getAll: async () => {
    const response = await api.get('/stock');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/stock', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/stock/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/stock/${id}`);
    return response.data;
  }
};
