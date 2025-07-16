import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile, updateProfile as apiUpdateProfile } from '@/api';

// Use VueUse's useLocalStorage with proper serialization
const user = useLocalStorage('user', null, {
  serializer: {
    read: (value) => {
      try {
        return value === 'null' || value === null ? null : JSON.parse(value);
      } catch {
        return null;
      }
    },
    write: (value) => JSON.stringify(value)
  }
});

const token = useLocalStorage('token', null, {
  serializer: {
    read: (value) => value === 'null' || value === null ? null : value,
    write: (value) => value
  }
});

export function useAuth() {
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  const login = async (credentials) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await apiLogin(credentials);
      
      // Store token and user info immediately from login response
      console.log('Login response:', response.data);
      token.value = response.data.token;
      user.value = response.data.user;
      console.log('Stored token:', token.value);
      console.log('Stored user:', user.value);
      
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await apiRegister(userData);
      
      // Store token and user info immediately from register response
      token.value = response.data.token;
      user.value = response.data.user;
      
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      token.value = null;
      user.value = null;
      // Clear cart and payment data on logout
      localStorage.removeItem('cartItems');
      localStorage.removeItem('paymentReference');
      localStorage.removeItem('pendingOrderId');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await apiUpdateProfile(profileData);
      user.value = response.data;
      
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Profile update failed';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const checkAuth = async () => {
    console.log('checkAuth called, token:', token.value); // Debug log
    if (!token.value) {
      console.log('No token found, user not authenticated'); // Debug log
      return;
    }
    
    try {
      console.log('Validating token with profile API...'); // Debug log
      const response = await getProfile();
      user.value = response.data;
      console.log('Auth validated, user:', user.value); // Debug log
    } catch (err) {
      console.log('Token validation failed, clearing auth:', err); // Debug log
      // Token is invalid, clear it
      token.value = null;
      user.value = null;
    }
  };

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isAdmin,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  };
}
