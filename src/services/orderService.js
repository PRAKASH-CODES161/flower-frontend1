import api from './api';

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/orders', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/orders/${id}`, item);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};
