<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Products</h1>
      <div class="mt-3 sm:mt-0">
        <button
          @click="$emit('change-section', 'add-product')"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <PlusCircle class="-ml-1 mr-2 h-5 w-5" />
          Add Product
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 bg-white p-4 shadow rounded-lg">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              v-model="searchQuery"
              @input="handleSearch"
              class="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search products"
            />
          </div>
        </div>
        <div class="w-full sm:w-40">
          <label for="category" class="sr-only">Category</label>
          <select
            id="category"
            v-model="categoryFilter"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white shadow rounded-lg p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white shadow rounded-lg p-8 text-center">
      <AlertTriangle class="mx-auto h-12 w-12 text-red-400" />
      <p class="mt-4 text-red-600">{{ error }}</p>
      <button @click="fetchProducts" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>

    <!-- Products Table for larger screens -->
    <div v-else class="hidden sm:block bg-white shadow overflow-hidden sm:rounded-md">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-md object-cover" :src="getImageUrl(product.image)" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">₦{{ product.price.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.stock }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editProduct(product)" class="text-gray-600 hover:text-gray-900 mr-3">
                  Edit
                </button>
                <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Mobile product cards -->
    <div v-if="!isLoading && !error" class="sm:hidden space-y-4">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="bg-white shadow overflow-hidden rounded-md"
      >
        <div class="p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12">
              <img class="h-12 w-12 rounded-md object-cover" :src="getImageUrl(product.image)" alt="" />
            </div>
            <div class="ml-4 flex-1">
              <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
              <div class="text-sm text-gray-500">{{ product.category }}</div>
            </div>
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ product.status }}
            </span>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <div>
              <div class="text-sm font-medium text-gray-900">₦{{ product.price.toFixed(2) }}</div>
              <div class="text-xs text-gray-500">Stock: {{ product.stock }}</div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editProduct(product)" 
                class="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-xs text-gray-700"
              >
                <Edit class="h-4 w-4" />
              </button>
              <button 
                @click="handleDeleteProduct(product.id)" 
                class="inline-flex items-center p-1.5 border border-red-300 rounded-md text-xs text-red-700"
              >
                <Trash class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    <!-- Empty State -->
    <div v-if="!isLoading && !error && filteredProducts.length === 0" class="py-12 text-center bg-white shadow rounded-lg">
      <Package class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-800">No products</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
      <div class="mt-6">
        <button
          @click="$emit('change-section', 'add-product')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <PlusCircle class="-ml-1 mr-2 h-5 w-5" />
          Add Product
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete "{{ productToDelete?.name }}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="handleDeleteFromModal" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Delete
            </button>
            <button @click="showDeleteModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  PlusCircle, 
  Search, 
  Package, 
  AlertTriangle,
  Edit,
  Trash
} from 'lucide-vue-next';
import { getProducts, deleteProduct, getImageUrl, searchProducts } from '@/api';

const emit = defineEmits(['change-section', 'edit-product']);

const products = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Fetch products from backend
const fetchProducts = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getProducts();
    products.value = response.data.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.stock > 0 ? 'Active' : 'Out of Stock',
      image: product.image
    }));
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error.value = 'Failed to load products';
  } finally {
    isLoading.value = false;
  }
};

// Delete product
const handleDeleteProduct = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }
  
  try {
    await deleteProduct(productId);
    await fetchProducts(); // Refresh the list
  } catch (err) {
    console.error('Failed to delete product:', err);
    alert('Failed to delete product. Please try again.');
  }
};

onMounted(fetchProducts);

// Filters and search
const searchQuery = ref('');
const categoryFilter = ref('');
const isSearching = ref(false);
const searchTimeout = ref(null);

// Delete modal
const showDeleteModal = ref(false);
const productToDelete = ref(null);

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Apply category filter (client-side for better UX)
  if (categoryFilter.value) {
    result = result.filter(product => 
      product.category.toLowerCase() === categoryFilter.value.toLowerCase()
    );
  }
  
  return result;
});

// Handle search with debouncing
const handleSearch = () => {
  // Clear existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  // Set new timeout for debounced search
  searchTimeout.value = setTimeout(async () => {
    const query = searchQuery.value.trim();
    
    if (query) {
      await performSearch(query);
    } else {
      await fetchProducts();
    }
  }, 300); // 300ms debounce
};

// Perform backend search
const performSearch = async (query) => {
  try {
    isLoading.value = true;
    isSearching.value = true;
    const response = await searchProducts(query);
    products.value = response.data || [];
  } catch (err) {
    console.error('Search failed:', err);
    error.value = 'Search failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Methods
const editProduct = (product) => {
  emit('edit-product', product);
  emit('change-section', 'add-product');
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const handleDeleteFromModal = async () => {
  if (productToDelete.value) {
    try {
      await deleteProduct(productToDelete.value.id);
      await fetchProducts(); // Refresh the list from backend
      showDeleteModal.value = false;
      productToDelete.value = null;
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  }
};

// Expose fetchProducts method for parent component
defineExpose({
  fetchProducts
});
</script>