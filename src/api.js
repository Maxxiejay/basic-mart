import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       // Redirect to login if needed
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

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
export const getAllOrdersAdmin = () => api.get('/orders/admin/all');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// --- Payment Processing ---
export const initializePayment = () => api.post('/payments/initialize');
export const verifyPayment = (reference) => api.get(`/payments/verify/${reference}`);
export const getPaymentStatus = (orderId) => api.get(`/payments/status/${orderId}`);

// --- User Authentication & Profile ---
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);

// --- Admin Features ---
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const updateAdminAccount = (data) => api.put('/admin/account', data);

// --- User Management (Admin Only) ---
export const getAllUsersAdmin = () => api.get('/admin/users');
export const getUserAdmin = (id) => api.get(`/admin/users/${id}`);
export const createUserAdmin = (userData) => api.post('/admin/users', userData);
export const updateUserAdmin = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserRoleAdmin = (id) => api.patch(`/admin/users/${id}/toggle-role`);

// --- Search ---
export const searchProducts = (q) => api.get('/search', { params: { q } });

// --- Utility Functions ---
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) return imagePath;
  // If it's a blob URL (for previews), return as is
  if (imagePath.startsWith('blob:')) return imagePath;
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default api;
