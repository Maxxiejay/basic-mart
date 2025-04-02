<template>
  <div class="cart-container p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-md font-semibold">Your Cart ({{ totalItems }})</h2>
      <button 
        v-if="cartItems.length > 0"
        @click="clearCart" 
        class="text-sm text-red-500 hover:text-red-700"
      >
        Clear All
      </button>
    </div>

    <!-- Empty Cart State -->
    <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-gray-500">Your cart is empty</p>
      <button 
        @click="$emit('continue-shopping')" 
        class="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        Continue Shopping
      </button>
    </div>

    <!-- Cart Items -->
    <div v-else class="overflow-y-auto max-h-[calc(60vh-250px)]">
      <CartItem 
        v-for="item in cartItems" 
        :key="item.id" 
        :item="item"
        @update:quantity="updateItemQuantity"
        @remove="removeFromCart"
      />
    </div>

    <!-- Cart Summary -->
    <div v-if="cartItems.length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${{ total.toFixed(2) }}</span>
      </div>
      <button 
        @click="$emit('checkout')" 
        class="w-full mt-4 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Checkout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '@/composables/useCart';
import CartItem from './CartItem.vue';

const { cartItems, totalItems, total, updateItemQuantity, removeFromCart, clearCart } = useCart();

const emit = defineEmits(['checkout', 'continue-shopping']);
</script>

<style scoped>

</style>