<template>
  <div class="home flex flex-col gap-6">
    <HeroSection />
    <main id="products" class="mt-10">
      <div class="container mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-primaryDark">
            {{ isSearching ? `Search results for "${searchQuery}"` : 'you might need' }}
          </h1>
          <div v-if="isSearching" class="text-sm text-gray-600">
            {{ products.length }} {{ products.length === 1 ? 'result' : 'results' }} found
          </div>
        </div>

        <!-- Show LoadingSpinner while products are being fetched -->
        <LoadingSpinner v-if="isLoading" size="large" class="my-24" />

        <!-- Show error message if there's an error -->
        <div v-else-if="error" class="text-center py-24">
          <p class="text-red-600 text-lg">{{ error }}</p>
          <button @click="fetchProducts" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Try Again
          </button>
        </div>

        <!-- Show products once data is loaded -->
        <div v-else-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6 py-4">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <!-- Show no results message for search -->
        <div v-else-if="isSearching" class="text-center py-24">
          <p class="text-gray-600 text-lg">No products found for "{{ searchQuery }}"</p>
          <button @click="clearSearch" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Show All Products
          </button>
        </div>
      </div>
    </main>

    <!-- Floating WhatsApp Button -->
    <div class="fixed bottom-6 right-6 z-50">
      <button 
        @click="openWhatsApp" 
        class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessageCircle } from 'lucide-vue-next';
import HeroSection from '@/components/HeroSection.vue';
import ProductCard from '@/components/ProductCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getProducts, searchProducts } from '@/api';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const isSearching = ref(false);

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Fetch from backend API
    const response = await getProducts({ limit: 20 });
    products.value = response.data.map(product => ({
      id: product.id,
      title: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      thumbnail: product.image
    }));
  } catch (err) {
    console.error('Failed to load products from backend:', err);
    error.value = 'Failed to load products. Please check your connection and try again.';
  } finally {
    isLoading.value = false;
  }
};

const performSearch = async (query) => {
  try {
    isLoading.value = true;
    error.value = null;
    isSearching.value = true;
    searchQuery.value = query;
    
    const response = await searchProducts(query);
    products.value = response.data.map(product => ({
      id: product.id,
      title: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      thumbnail: product.image
    }));
  } catch (err) {
    console.error('Search failed:', err);
    error.value = 'Search failed. Please try again.';
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const clearSearch = () => {
  isSearching.value = false;
  searchQuery.value = '';
  router.push({ name: 'home' });
  fetchProducts();
};

// WhatsApp function
const openWhatsApp = () => {
  const phoneNumber = '+2347038055097'; // Replace with your actual WhatsApp number
  const message = 'Hello! I need assistance with your products.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

// Watch for route changes to handle search queries
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    performSearch(newSearch);
  } else if (isSearching.value) {
    clearSearch();
  }
}, { immediate: true });

// Fetch products when the component mounts (if no search query)
onMounted(() => {
  if (!route.query.search) {
    fetchProducts();
  }
});
</script>
