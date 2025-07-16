<template>
  <div class="cart-container p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-md font-semibold">Your Cart ({{ totalItems }})</h2>
      <button v-if="cartItems.length > 0" @click="clearCart" class="text-sm text-red-500 hover:text-red-700">
        Clear All
      </button>
    </div>

    <!-- Empty Cart State -->
    <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-gray-500">Your cart is empty</p>
      <button @click="$emit('continue-shopping')"
        class="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
        Continue Shopping
      </button>
    </div>

    <!-- Cart Items -->
    <div v-else class="overflow-y-auto max-h-[calc(60vh-250px)] md:max-h-[calc(80vh-250px)]">
      <div v-if="cartItems.length === 0" class="text-center py-4 text-gray-500">
        No items in cart (but cartItems.length > 0?)
      </div>
      <CartItem v-for="item in cartItems" :key="item.id || item.cartItemId" :item="item"
        @update:quantity="updateItemQuantity" @remove="removeFromCart" />
    </div>

    <!-- Cart Summary -->
    <div v-if="cartItems.length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <!-- Delivery Info Required Message -->
      <div v-if="showDeliveryInfoRequired" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-blue-800">Delivery Information Required</h3>
            <p class="mt-1 text-sm text-blue-700">
              Please add your delivery information to complete your order. We need your address and contact details for delivery.
            </p>
            <div class="mt-3 flex space-x-3">
              <button 
                @click="goToDashboard"
                class="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Delivery Info
              </button>
              <button 
                @click="dismissDeliveryInfo"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error && !showDeliveryInfoRequired && !(error.toLowerCase().includes('delivery'))" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>₦{{ total.toFixed(2) }}</span>
      </div>
      <button @click="handleCheckout" :disabled="isLoading"
        class="w-full mt-4 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="isLoading">Processing...</span>
        <span v-else>Checkout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCart } from '@/composables/useCart';
import { useAuth } from '@/composables/useAuth';
import { getImageUrl } from '@/api';
import CartItem from './CartItem.vue';

const { cartItems, totalItems, total, updateItemQuantity, removeFromCart, clearCart, checkout, isLoading, error } = useCart();
const { user, isAuthenticated } = useAuth();

const emit = defineEmits(['checkout-success', 'continue-shopping']);

// Check if user has delivery info
const hasDeliveryInfo = computed(() => {
  if (!isAuthenticated.value || !user.value) return true; // For guests, no check needed
  
  return !!(
    user.value.address || 
    user.value.city ||
    user.value.country
  );
});

// State for delivery info notification
const showDeliveryInfoRequired = ref(false);

const handleCheckout = async () => {
  // Check if user is authenticated first
  if (!isAuthenticated.value) {
    alert('Please sign in to continue with checkout');
    // Redirect to login page
    window.location.href = '/login';
    return;
  }

  // Check delivery info before attempting checkout
  if (!hasDeliveryInfo.value) {
    showDeliveryInfoRequired.value = true;
    return;
  }

  try {
    const result = await checkout();
    if (result.success) {
      // For payment redirects, the user will be redirected to Paystack
      if (result.method === 'payment_redirect') {
        // User is being redirected to payment page, no need to emit success here
        console.log('Payment initialized, redirecting to Paystack...');
      }
    } else if (result.requiresAuth) {
      // Handle authentication requirement
      alert('Please sign in to continue with checkout');
      window.location.href = '/login';
    } else if (result.requiresDeliveryInfo || (result.error && result.error.toLowerCase().includes('delivery'))) {
      // Fallback: Show delivery info required notification for missing delivery info
      showDeliveryInfoRequired.value = true;
    } else {
      // Error is already handled in the composable and displayed in the template
      console.error('Checkout failed:', result.error);
    }
  } catch (err) {
    console.error('Unexpected checkout error:', err);
  }
};

const goToDashboard = () => {
  // Navigate to dashboard to add delivery info
  window.location.href = '/dashboard';
};

const dismissDeliveryInfo = () => {
  // Hide the delivery info notification
  showDeliveryInfoRequired.value = false;
};
</script>

<style scoped></style>