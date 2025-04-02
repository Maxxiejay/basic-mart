<template>
  <div class="home flex flex-col gap-6">
    <HeroSection />
    <main id="products" class="mt-10">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold mb-4 text-primaryDark">you might need</h1>

        <!-- Show LoadingSpinner while products are being fetched -->
        <LoadingSpinner v-if="isLoading" size="large" class="my-24" />

        <!-- Show products once data is loaded -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6 py-4">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeroSection from '@/components/HeroSection.vue';
import ProductCard from '@/components/ProductCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue'; // Import the LoadingSpinner component

const products = ref([]);
const isLoading = ref(true); // Track loading state

const fetchProducts = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products/category/groceries?limit=20');
    const data = await response.json();

    // Transform API data to match your product structure
    products.value = data.products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price.toFixed(2), // Convert price to string with 2 decimal places
      thumbnail: product.thumbnail // Using thumbnail as the product image
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isLoading.value = false; // Set loading to false after fetching data
  }
};

// Fetch products when the component mounts
onMounted(fetchProducts);
</script>
