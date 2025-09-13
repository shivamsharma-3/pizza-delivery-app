import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API functions
export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (userData) => {
  return api.post('/auth/login', userData);
};

// Inventory API functions
export const fetchInventory = () => {
  return api.get('/inventory');
};

export const calculatePizzaPrice = (pizzaData) => {
  return api.post('/inventory/calculate-price', pizzaData);
};

// Admin API functions
export const getAdminDashboard = () => {
  return api.get('/admin/dashboard');
};

export const getAdminOrders = (params) => {
  return api.get('/admin/orders', { params });
};

export const updateOrderStatus = (orderId, statusData) => {
  return api.put(`/admin/orders/${orderId}/status`, statusData);
};

export const getAdminInventory = (params) => {
  return api.get('/admin/inventory', { params });
};

export const updateInventoryItem = (itemId, updateData) => {
  return api.put(`/admin/inventory/${itemId}`, updateData);
};

export const getAdminUsers = (params) => {
  return api.get('/admin/users', { params });
};

// Order API functions
export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getUserOrders = (params) => {
  return api.get('/orders/my-orders', { params });
};

export const getOrderDetails = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const trackOrderByNumber = (orderNumber) => {
  return api.get(`/orders/track/${orderNumber}`);
};

export const cancelOrder = (orderId, reason) => {
  return api.put(`/orders/${orderId}/cancel`, { reason });
};

export const reviewOrder = (orderId, reviewData) => {
  return api.post(`/orders/${orderId}/review`, reviewData);
};


export default api;

