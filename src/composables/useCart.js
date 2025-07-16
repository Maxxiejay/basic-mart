import { ref, computed, onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useAuth } from './useAuth';
import { 
  getCart as apiGetCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem, 
  removeCartItem as apiRemoveCartItem, 
  clearCart as apiClearCart,
  placeOrder as apiPlaceOrder,
  initializePayment,
  verifyPayment,
  getPaymentStatus
} from '@/api';

export function useCart() {
  const { isAuthenticated } = useAuth();
  
  // Use localStorage as the single source of truth for cart state
  const cartItems = useLocalStorage('cartItems', []);
  const isLoading = ref(false);
  const error = ref(null);

  // Compute total items in the cart
  const totalItems = computed(() =>
    cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0)
  );

  // Compute total price of the cart
  const total = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0)
  );

  // Fetch cart from backend and update localStorage
  const fetchAndUpdateCart = async () => {
    if (!isAuthenticated.value) {
      console.log('User not authenticated, skipping backend fetch');
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      console.log('Fetching cart from backend...');
      
      const response = await apiGetCart();
      console.log('Backend cart response:', response.data);
      
      // Transform backend response to UI format
      let items = [];
      if (response.data.CartItems && Array.isArray(response.data.CartItems)) {
        items = response.data.CartItems.map(cartItem => ({
          id: cartItem.Product.id,
          cartItemId: cartItem.id,
          title: cartItem.Product.name,
          name: cartItem.Product.name,
          price: parseFloat(cartItem.Product.price),
          thumbnail: cartItem.Product.image,
          image: cartItem.Product.image,
          quantity: parseInt(cartItem.quantity)
        }));
      }

      // Update localStorage (which updates cartItems reactively)
      cartItems.value = items;
      console.log('Cart updated from backend:', items);
      
    } catch (err) {
      console.error('Failed to fetch cart from backend:', err);
      error.value = err.response?.data?.message || 'Failed to load cart';
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize cart - fetch from backend if authenticated
  const initializeCart = async () => {
    console.log('Initializing cart, isAuthenticated:', isAuthenticated.value);
    if (isAuthenticated.value) {
      await fetchAndUpdateCart();
    } else {
      console.log('Guest user, using existing localStorage cart:', cartItems.value);
    }
  };

  // Add an item to the cart
  const addToCart = async (product) => {
    console.log('Adding to cart:', product);
    
    if (!isAuthenticated.value) {
      // Handle locally for guest users
      const existingItem = cartItems.value.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.value.push({
          id: product.id,
          title: product.title || product.name,
          name: product.title || product.name,
          price: parseFloat(product.price),
          thumbnail: product.thumbnail || product.image,
          image: product.thumbnail || product.image,
          quantity: 1
        });
      }
      console.log('Guest cart updated:', cartItems.value);
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      await apiAddToCart({
        productId: product.id,
        quantity: 1
      });
      
      // Fetch updated cart from backend
      await fetchAndUpdateCart();
      
    } catch (err) {
      console.error('Failed to add to cart:', err);
      error.value = err.response?.data?.message || 'Failed to add to cart';
    } finally {
      isLoading.value = false;
    }
  };

  // Update the quantity of an item
  const updateItemQuantity = async ({ id, quantity }) => {
    if (!isAuthenticated.value) {
      // Handle locally for guest users
      const item = cartItems.value.find(item => item.id === id);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          const index = cartItems.value.findIndex(item => item.id === id);
          cartItems.value.splice(index, 1);
        }
      }
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      const item = cartItems.value.find(item => item.id === id);
      if (!item) return;

      if (quantity > 0) {
        await apiUpdateCartItem(item.cartItemId, { quantity });
      } else {
        await apiRemoveCartItem(item.cartItemId);
      }
      
      // Fetch updated cart from backend
      await fetchAndUpdateCart();
      
    } catch (err) {
      console.error('Failed to update cart item:', err);
      error.value = 'Failed to update cart item';
    } finally {
      isLoading.value = false;
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (id) => {
    if (!isAuthenticated.value) {
      // Handle locally for guest users
      const index = cartItems.value.findIndex(item => item.id === id);
      if (index !== -1) {
        cartItems.value.splice(index, 1);
      }
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      const item = cartItems.value.find(item => item.id === id);
      if (!item) return;

      await apiRemoveCartItem(item.cartItemId);
      
      // Fetch updated cart from backend
      await fetchAndUpdateCart();
      
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      error.value = 'Failed to remove from cart';
    } finally {
      isLoading.value = false;
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    if (!isAuthenticated.value) {
      cartItems.value = [];
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      await apiClearCart();
      
      // Fetch updated cart from backend (should be empty)
      await fetchAndUpdateCart();
      
    } catch (err) {
      console.error('Failed to clear cart:', err);
      error.value = 'Failed to clear cart';
    } finally {
      isLoading.value = false;
    }
  };

  // Checkout functionality with Paystack payment integration
  const checkout = async () => {
    if (!isAuthenticated.value) {
      // Require authentication for checkout
      error.value = 'Please sign in to continue with checkout';
      return { 
        success: false, 
        error: 'Please sign in to continue with checkout',
        requiresAuth: true 
      };
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      // Initialize payment instead of directly placing order
      console.log('Initializing payment...');
      const response = await initializePayment();
      console.log('Payment initialization response:', response);
      console.log('Response data:', response.data);
      
      // Handle nested data structure from backend
      const paymentData = response.data.data || response.data;
      
      if (paymentData && paymentData.authorization_url) {
        // Store payment reference and order ID for later verification
        localStorage.setItem('paymentReference', paymentData.reference);
        localStorage.setItem('pendingOrderId', paymentData.orderId);
        
        // Redirect to Paystack payment page
        window.location.href = paymentData.authorization_url;
        
        return { 
          success: true, 
          method: 'payment_redirect',
          reference: paymentData.reference,
          orderId: paymentData.orderId
        };
      } else {
        console.error('Invalid response structure:', response.data);
        throw new Error('Failed to initialize payment - missing authorization_url');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      error.value = err.response?.data?.message || 'Failed to initialize payment';
      
      // If delivery info is missing, return specific error
      if (err.response?.status === 400 && err.response?.data?.message?.includes('delivery')) {
        return { 
          success: false, 
          error: err.response.data.message, 
          requiresDeliveryInfo: true 
        };
      }
      
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Verify payment after user returns from Paystack
  const verifyPaymentAndCompleteOrder = async (reference) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await verifyPayment(reference);
      
      if (response.data.success) {
        // Payment successful, clear cart
        await clearCart();
        
        // Clean up stored payment data
        localStorage.removeItem('paymentReference');
        localStorage.removeItem('pendingOrderId');
        
        return { 
          success: true, 
          order: response.data.order,
          paymentStatus: response.data.paymentStatus
        };
      } else {
        return { 
          success: false, 
          error: 'Payment verification failed',
          paymentStatus: response.data.paymentStatus
        };
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      error.value = err.response?.data?.message || 'Failed to verify payment';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Check payment status for an order
  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await getPaymentStatus(orderId);
      return response.data;
    } catch (err) {
      console.error('Failed to check payment status:', err);
      return { status: 'unknown', error: err.response?.data?.message };
    }
  };

  // Handle login transition - sync local cart to server and fetch updated cart
  const handleLogin = async () => {
    console.log('Handling login transition...');
    
    // If there are items in localStorage, sync them to server first
    if (cartItems.value.length > 0) {
      console.log('Syncing local cart to server:', cartItems.value);
      try {
        for (const item of cartItems.value) {
          await apiAddToCart({
            productId: item.id,
            quantity: item.quantity
          });
        }
      } catch (err) {
        console.error('Failed to sync cart to server:', err);
      }
    }
    
    // Fetch the updated cart from backend
    await fetchAndUpdateCart();
  };

  // Handle logout transition - clear cart localStorage
  const handleLogout = () => {
    console.log('Handling logout transition, clearing cart localStorage');
    cartItems.value = [];
    // Clear any payment references as well
    localStorage.removeItem('paymentReference');
    localStorage.removeItem('pendingOrderId');
  };

  // Initialize cart when composable is created
  onMounted(() => {
    initializeCart();
  });

  return {
    cartItems,
    totalItems,
    total,
    isLoading,
    error,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    checkout,
    verifyPaymentAndCompleteOrder,
    checkPaymentStatus,
    initializeCart,
    fetchAndUpdateCart,
    handleLogin,
    handleLogout
  };
}
