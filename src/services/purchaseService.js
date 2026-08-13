import api from './api';

export const purchaseService = {
  getAll: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/purchases', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/purchases/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  }
};
