import api from './api';

export const salesService = {
  getAll: async () => {
    const response = await api.get('/sales');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/sales', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/sales/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  }
};
