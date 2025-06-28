import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // if using cookies for auth, else remove
});

// --- Product Management ---
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// --- Cart Management ---
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart');

// --- Order Processing ---
export const placeOrder = () => api.post('/orders');
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getAllOrdersAdmin = () => api.get('/admin/orders');

// --- User Authentication & Profile ---
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);

// --- Admin Features ---
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const updateAdminAccount = (data) => api.put('/admin/account', data);

// --- Search ---
export const searchProducts = (q) => api.get('/search', { params: { q } });

export default api;
