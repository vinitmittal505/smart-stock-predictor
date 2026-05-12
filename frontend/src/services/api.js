import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api', // Use environment variable for API base URL
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const inventoryAPI = {
  getInventory: () => api.get('/inventory'),
  getSuppliers: () => api.get('/inventory/suppliers'),
  getLogs: () => api.get('/inventory/logs'),
  addItem: (data) => api.post('/inventory', data),
  updateItem: (sku, data) => api.patch(`/inventory/${sku}`, data),
  deleteItem: (sku) => api.delete(`/inventory/${sku}`),
  executePO: (sku) => api.post(`/inventory/execute-po/${sku}`),
};

export default api;
