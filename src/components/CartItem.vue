<template>
    <div class="cart-item flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <!-- Product Image -->
      <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
        <img 
          :src="item.thumbnail" 
          :alt="item.title" 
          class="w-full h-full object-cover"
          @error="onImageError"
        />
      </div>
      
      <!-- Product Details -->
      <div class="flex-grow min-w-0">
        <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</h3>
        <p v-if="item.variant" class="text-xs text-gray-500">{{ item.variant }}</p>
        <div class="mt-1 flex items-center">
          <!-- Quantity Controls -->
          <div class="flex items-center border border-gray-300 rounded-md">
            <button 
              @click="updateQuantity(-1)" 
              class="px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              :disabled="item.quantity <= 1"
            >
              <span class="sr-only">Decrease</span>
              <span>−</span>
            </button>
            <span class="px-2 py-1 text-sm text-center w-8">{{ item.quantity }}</span>
            <button 
              @click="updateQuantity(1)" 
              class="px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span class="sr-only">Increase</span>
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Price and Remove -->
      <div class="flex flex-col items-end ml-2">
        <span class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</span>
        <button 
          @click="removeItem" 
          class="mt-1 text-xs text-red-500 hover:text-red-700 focus:outline-none"
        >
          Remove
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true,
      validator: (item) => {
        return item.id && item.name && item.price !== undefined && item.quantity !== undefined;
      }
    }
  });
  
  const emit = defineEmits(['update:quantity', 'remove']);
  
  const updateQuantity = (change) => {
    const newQuantity = Math.max(1, props.item.quantity + change);
    emit('update:quantity', {
      id: props.item.id,
      quantity: newQuantity
    });
  };
  
  const removeItem = () => {
    emit('remove', props.item.id);
  };
  
  // Handle image loading errors
  const onImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
  };
  </script>