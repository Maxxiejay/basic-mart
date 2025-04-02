<template>
  <div class="container mx-auto p-4">
    <!-- Product Details Section -->
    <div v-if="product" class="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
      <!-- Product Image -->
      <div class="flex-shrink-0">
        <img :src="product.thumbnail" :alt="product.title" class="w-64 h-64 object-contain mx-auto" />
      </div>

      <!-- Product Info -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-2">{{ product.title }}</h1>
        <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
        <p class="text-gray-500 text-sm mb-4">Weight: {{ product.weight || 'N/A' }}</p>
        <p class="text-lg font-bold mb-4">${{ product.price }}</p>

        <!-- Add to Cart Button or Quantity Selector -->
        <div v-if="cartQuantity > 0" class="w-full md:max-w-[200px] bg-green-100 rounded-md flex items-center justify-between p-2 font-bold text-primaryDark text-xl">
          <button @click="decreaseQuantity" class="flex items-center justify-center font-bold border-2 border-primaryDark rounded-full w-10 h-10">
            <span>−</span>
          </button>
          <span class="mx-3 text-primaryDark">{{ cartQuantity }}</span>
          <button @click="increaseQuantity" class="flex items-center justify-center font-bold border-2 border-primaryDark rounded-full w-10 h-10">
            <span>+</span>
          </button>
        </div>
        <button v-else @click="increaseQuantity" class="w-full md:max-w-[200px] rounded-md py-2 bg-primary text-white font-bold text-lg hover:bg-primaryDark">
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-10">
      <p class="text-gray-500">Loading product details...</p>
    </div>

    <!-- Related Products Section -->
    <div v-if="relatedProducts.length > 0" class="mt-8">
      <h2 class="text-xl font-bold mb-4">Related Products</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // To access route params
import { useCart } from '@/composables/useCart';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute(); // Access the current route
const product = ref(null); // Product data
const relatedProducts = ref([]); // Related products data

// Fetch product details by ID
const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const data = await response.json();
    console.log(data)
    product.value = data;

    // Fetch related products (for simplicity, using the same API)
    const relatedResponse = await fetch(`https://dummyjson.com/products/category/${data.category}`);
    if (relatedResponse.ok) {
      const relatedData = await relatedResponse.json();
      relatedProducts.value = relatedData.products.filter(p => p.id !== productId).slice(0, 4); // Exclude current product
    }
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }
};

// Fetch the product when the component is mounted
onMounted(() => {
  const productId = route.params.id; // Get product ID from the route params
  fetchProductDetails(productId);
});

// Use the cart composable
const { cartItems, addToCart, updateItemQuantity, removeFromCart } = useCart();

// Compute the quantity of the product in the cart
const cartQuantity = computed(() => {
  const item = cartItems.value.find(item => item.id === product.value?.id);
  return item ? item.quantity : 0;
});

// Increase the quantity of the product in the cart
const increaseQuantity = () => {
  if (product.value) {
    if (cartQuantity.value === 0) {
      addToCart(product.value);
    } else {
      updateItemQuantity({ id: product.value.id, quantity: cartQuantity.value + 1 });
    }
  }
};

// Decrease the quantity of the product in the cart
const decreaseQuantity = () => {
  if (product.value) {
    if (cartQuantity.value > 1) {
      updateItemQuantity({ id: product.value.id, quantity: cartQuantity.value - 1 });
    } else if (cartQuantity.value === 1) {
      removeFromCart(product.value.id);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.bg-primary {
  background-color: #4caf50;
}
.bg-primaryDark {
  background-color: #388e3c;
}
.text-primaryDark {
  color: #388e3c;
}
</style>
