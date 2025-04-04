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
      <form @submit.prevent="saveProduct" class="p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <!-- Product Image -->
          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div class="mt-1 flex flex-col sm:flex-row items-start sm:items-center">
              <div class="h-32 w-32 overflow-hidden rounded-md bg-gray-100">
                <img v-if="form.imageUrl" :src="form.imageUrl" alt="Product preview"
                  class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center">
                  <Image class="h-12 w-12 text-gray-300" />
                </div>
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-5 flex-1">
                <div class="relative rounded-md shadow-sm">
                  <input type="text" v-model="form.imageUrl"
                    class="focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter image URL" />
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Enter a URL for the product image or use the upload button.
                </p>
                <div class="mt-1">
                  <label for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImageUpload"
                      accept="image/*" />
                  </label>
                </div>
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
          <button type="submit"
            class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            {{ isEditing ? 'Update Product' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ArrowLeft, Image } from 'lucide-vue-next';

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
  description: '',
  imageUrl: ''
});

// Check if we're editing an existing product
const isEditing = computed(() => !!form.value.id);

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    description: '',
    imageUrl: ''
  };
};

// Watch for changes to productToEdit
watch(() => props.productToEdit, (newProduct) => {
  if (newProduct) {
    form.value = { ...newProduct };
  } else {
    resetForm();
  }
}, { immediate: true });

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // In a real app, you would upload this file to a server
    // For demo purposes, we'll create a local URL
    form.value.imageUrl = URL.createObjectURL(file);
  }
};

const saveProduct = () => {
  emit('save-product', { ...form.value });
  emit('change-section', 'products');

  if (!isEditing.value) {
    resetForm();
  }
};


</script>