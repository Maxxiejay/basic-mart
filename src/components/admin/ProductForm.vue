<template>
  <div>
    <div class="mb-6 flex items-center">
      <button @click="$emit('change-section', 'products')" class="mr-4 text-gray-500 hover:text-gray-700">
        <ArrowLeft class="h-5 w-5" />
      </button>
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">
        {{ isEditing ? 'Edit Product' : 'Add New Product' }}
      </h1>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 m-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="saveProduct" class="p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <!-- Product Image -->
          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div class="mt-1 flex flex-col sm:flex-row items-start sm:items-center">
              <div class="h-32 w-32 overflow-hidden rounded-md bg-gray-100">
                <img v-if="imagePreview" :src="imagePreview" alt="Product preview"
                  class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center">
                  <Image class="h-12 w-12 text-gray-300" />
                </div>
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-5 flex-1">
                <div class="mt-1">
                  <label for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none border border-gray-300 px-4 py-2 inline-block">
                    <span>{{ selectedFile ? 'Change Image' : 'Select Image' }}</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImageUpload"
                      accept="image/*" />
                  </label>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  {{ selectedFile ? `Selected: ${selectedFile.name}` : 'Select an image file for the product' }}
                </p>
                <p v-if="selectedFile" class="mt-1 text-xs text-gray-400">
                  Size: {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                </p>
              </div>
            </div>
          </div>

          <!-- Product Name -->
          <div class="sm:col-span-6 md:col-span-3">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <div class="mt-1">
              <input type="text" id="name" v-model="form.name" required
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>

          <!-- Category -->
          <div class="sm:col-span-6 md:col-span-3">
            <label for="category" class="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div class="mt-1">
              <select id="category" v-model="form.category" required
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <!-- Price -->
          <div class="sm:col-span-6 md:col-span-2">
            <label for="price" class="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input type="number" id="price" v-model="form.price" min="0" step="0.01" required
                class="focus:ring-gray-500 focus:border-gray-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>

          <!-- Stock -->
          <div class="sm:col-span-6 md:col-span-2">
            <label for="stock" class="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <div class="mt-1">
              <input type="number" id="stock" v-model="form.stock" min="0" required
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>

          <!-- Status -->
          <div class="sm:col-span-6 md:col-span-2">
            <label for="status" class="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div class="mt-1">
              <select id="status" v-model="form.status" required
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="sm:col-span-6">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div class="mt-1">
              <textarea id="description" v-model="form.description" rows="4"
                class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button type="button" @click="$emit('change-section', 'products')"
            class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit" :disabled="isLoading || (!isEditing && !selectedFile)"
            class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">
              {{ isEditing ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ isEditing ? 'Update Product' : 'Create Product' }}
            </span>
          </button>
        </div>
        
        <!-- Validation message for required image -->
        <div v-if="!isEditing && !selectedFile" class="mt-2 text-right">
          <p class="text-sm text-gray-500">Image is required for new products</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { ArrowLeft, Image } from 'lucide-vue-next';
import { createProduct, updateProduct } from '@/api';

const props = defineProps({
  productToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['change-section', 'save-product']);

// Form state
const form = ref({
  id: null,
  name: '',
  category: '',
  price: '',
  stock: '',
  status: 'Active',
  description: ''
});

// File handling
const selectedFile = ref(null);
const imagePreview = ref(null);

// Loading and error states
const isLoading = ref(false);
const error = ref(null);

// Check if we're editing an existing product
const isEditing = computed(() => !!form.value.id);

const resetForm = () => {
  // Clean up preview URL if it's a blob URL
  if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value);
  }
  
  form.value = {
    id: null,
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    description: ''
  };
  selectedFile.value = null;
  imagePreview.value = null;
};

// Watch for changes to productToEdit
watch(() => props.productToEdit, (newProduct) => {
  if (newProduct) {
    form.value = {
      id: newProduct.id,
      name: newProduct.name,
      category: newProduct.category,
      price: newProduct.price.toString(),
      stock: newProduct.stock.toString(),
      status: newProduct.status,
      description: newProduct.description || ''
    };
    // Set image preview if editing existing product
    imagePreview.value = newProduct.image || null;
    selectedFile.value = null; // Reset file selection when editing
  } else {
    resetForm();
  }
}, { immediate: true });

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Clean up previous preview URL
    if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview.value);
    }
    
    selectedFile.value = file;
    // Create preview URL
    imagePreview.value = URL.createObjectURL(file);
  }
};

const saveProduct = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Create FormData to handle file upload
    const formData = new FormData();
    
    // Add all form fields to FormData
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', parseFloat(form.value.price));
    formData.append('category', form.value.category);
    formData.append('stock', parseInt(form.value.stock));
    formData.append('status', form.value.status);
    
    // Add image file if selected
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    let result;
    if (isEditing.value) {
      // Update existing product
      result = await updateProduct(form.value.id, formData);
    } else {
      // Create new product
      result = await createProduct(formData);
    }

    // Emit success and navigate back to products list
    emit('save-product', result.data);
    emit('change-section', 'products');

    if (!isEditing.value) {
      resetForm();
    }
  } catch (err) {
    console.error('Failed to save product:', err);
    error.value = err.response?.data?.message || 'Failed to save product';
  } finally {
    isLoading.value = false;
  }
};

// Cleanup blob URLs on component unmount
onUnmounted(() => {
  if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value);
  }
});


</script>