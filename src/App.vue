<template>
  <Navbar @toggle-cart="handleToggleCart" />
  <div id="main-content" class="mt-6 bg-gray-200">
    <router-view />
  </div>
  <BottomSheet v-model="showSheet" title="Cart">
    <Cart 
      :items="cartItems" 
      @update:items="updateCartItems" 
      @checkout-success="handleCheckoutSuccess"
      @continue-shopping="showSheet = false" 
    />
  </BottomSheet>
  <Footer />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import BottomSheet from '@/components/BottomSheet.vue';
import Cart from '@/components/Cart.vue';
import { ref, onMounted, watch } from 'vue';
import { useCart } from '@/composables/useCart';
import { useAuth } from '@/composables/useAuth';

const showSheet = ref(false);

const handleToggleCart = () => {
  console.log("Cart Toggled");
  showSheet.value = !showSheet.value;
};

// Use composables
const { cartItems, addToCart, updateItemQuantity, removeFromCart, clearCart, checkout, initializeCart, handleLogin, handleLogout } = useCart();
const { checkAuth, isAuthenticated } = useAuth();

// Update cart items (used by the Cart component)
const updateCartItems = (updatedItems) => {
  cartItems.value = updatedItems;
};

// Handle successful checkout
const handleCheckoutSuccess = (order) => {
  showSheet.value = false;
  // Show a better success message
  setTimeout(() => {
    alert(`🎉 Order placed successfully!\n\nOrder ID: #${order.id}\nTotal: ₦${order.total?.toFixed(2) || '0.00'}\n\nThank you for your purchase!`);
  }, 300);
};

// Initialize app
onMounted(async () => {
  console.log('App initializing...');
  await checkAuth(); // Check if user is already logged in
  console.log('Auth checked, isAuthenticated:', isAuthenticated.value);
  await initializeCart(); // Initialize cart based on auth state
  console.log('App initialization complete');
});

// Watch for authentication changes to trigger cart updates
watch(isAuthenticated, async (newValue, oldValue) => {
  console.log('Auth state changed in App:', { newValue, oldValue });
  if (newValue && !oldValue) {
    // User just logged in
    await handleLogin();
  } else if (!newValue && oldValue) {
    // User just logged out
    handleLogout();
  }
});
</script>

<style>
#app {
  background-color: #e5e7eb;
}

#main-content {
  margin: 0px 10px;
}
</style>
