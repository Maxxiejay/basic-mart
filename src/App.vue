<template>
  <Navbar @toggle-cart="handleToggleCart" />
  <div id="main-content" class="mt-6 bg-gray-200">
    <router-view />
  </div>
  <BottomSheet v-model="showSheet" title="Cart">
    <Cart 
      :items="cartItems" 
      @update:items="updateCartItems" 
      @checkout="checkout"
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
import { ref } from 'vue';
import { useCart } from '@/composables/useCart';

const showSheet = ref(false);

const handleToggleCart = () => {
  console.log("Cart Toggled");
  showSheet.value = !showSheet.value;
};

// Use the cart composable
const { cartItems, addToCart, updateItemQuantity, removeFromCart, clearCart, checkout } = useCart();

// Update cart items (used by the Cart component)
const updateCartItems = (updatedItems) => {
  cartItems.value = updatedItems;
};
</script>

<style>
#app {
  background-color: #e5e7eb;
}

#main-content {
  margin: 0px 10px;
}
</style>
