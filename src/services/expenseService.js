import api from './api';

export const expenseService = {
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/expenses', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/expenses/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};
