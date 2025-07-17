<template>
  <div class="bg-white rounded-lg shadow-sm p-2 flex flex-col items-center" @click.self="viewProduct(product.id)">
    <!-- Product Image -->
    <img :src="getImageUrl(product.thumbnail || product.image)" :alt="product.title || product.name" class="w-full h-24 object-contain mb-2">
    
    <!-- Product Name and Description -->
    <div class="text-center mb-1">
      <h3 class="font-medium text-sm">{{ product.title }}</h3>
      <p class="text-xs text-gray-600 line-clamp-2">({{ product.description }})</p>
    </div>
    
    <!-- Price -->
    <div class="flex items-baseline mb-4">
      <span class="text-lg font-bold">{{ product.price }}</span>
      <span class="text-xs align-top ml-0.5">₦</span>
    </div>
    
    <!-- Add to Cart Button or Quantity Selector -->
    <div v-if="cartQuantity > 0" class="w-full bg-green-100 rounded-md flex items-center justify-between p-1 font-bold text-primaryDark text-xl">
      <button @click="decreaseQuantity" class="flex items-center justify-center font-bold border-2 border-primaryDark rounded-full w-8 h-8">
        <span>−</span>
      </button>
      <span class="mx-3 text-primaryDark">{{ cartQuantity }}</span>
      <button @click="increaseQuantity" class="flex items-center justify-center font-bold border-2 border-primaryDark rounded-full w-8 h-8">
        <span>+</span>
      </button>
    </div>
    <button v-else @click="increaseQuantity" class="w-full rounded-md py-1 bg-gray-200 font-bold text-2xl">
      +
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCart } from '@/composables/useCart';
import { getImageUrl } from '@/api';
import router from '@/router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: 'Product Name',
      description: 'Description',
      price: '0.00',
      thumbnail: '/placeholder.jpg'
    })
  }
});

const viewProduct = (id)=>{
  router.push(`/products/${id}`);
}

// Use the cart composable
const { cartItems, addToCart, updateItemQuantity, removeFromCart } = useCart();

// Compute the quantity of the product in the cart
const cartQuantity = computed(() => {
  const item = cartItems.value.find(item => item.id === props.product.id);
  return item ? item.quantity : 0;
});

// Increase the quantity of the product in the cart
const increaseQuantity = () => {
  if (cartQuantity.value === 0) {
    addToCart(props.product);
  } else {
    updateItemQuantity({ id: props.product.id, quantity: cartQuantity.value + 1 });
  }
};

// Decrease the quantity of the product in the cart
const decreaseQuantity = () => {
  if (cartQuantity.value > 1) {
    updateItemQuantity({ id: props.product.id, quantity: cartQuantity.value - 1 });
  } else if (cartQuantity.value === 1) {
    removeFromCart(props.product.id);
  }
};
</script>