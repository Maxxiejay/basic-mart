<template>
    <AdminLayout ref="layout">
      <!-- Dynamic content based on current section -->
      <ProductsManagement 
        v-if="currentSection === 'products'" 
        @change-section="changeSection"
        @edit-product="editProduct"
      />
      
      <ProductForm 
        v-else-if="currentSection === 'add-product'" 
        :product-to-edit="productToEdit"
        @change-section="changeSection"
        @save-product="saveProduct"
      />
      
      <AccountSettings 
        v-else-if="currentSection === 'account'" 
      />
    </AdminLayout>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import AdminLayout from '@/components/admin/AdminLayout.vue';
  import ProductsManagement from '@/components/admin/ProductsManagement.vue';
  import ProductForm from '@/components/admin/ProductForm.vue';
  import AccountSettings from '@/components/admin/AccountSettings.vue';
  import useTitle from '@vueuse/core'
  
  const title = useTitle() 

  // State
  const layout = ref(null);
  const productToEdit = ref(null);
  
  // Get current section from layout
  const currentSection = computed(() => {
    return layout.value?.currentSection || 'products';
  });
  
  // Watch for changes to current section
  watch(() => currentSection.value, (newSection) => {
    // Reset product to edit when navigating away from add-product
    if (newSection !== 'add-product') {
      productToEdit.value = null;
    }
  });
  
  // Methods
  const changeSection = (section) => {
    if (layout.value) {
      layout.value.currentSection = section;
    }
  };
  
  const editProduct = (product) => {
    productToEdit.value = product;
  };
  
  const saveProduct = (product) => {
    console.log('Saving product:', product);
    // In a real app, this would update the products list
    // For now, just show a success message
    alert(`Product ${product.id ? 'updated' : 'created'} successfully!`);
    productToEdit.value = null;
  };
  </script>