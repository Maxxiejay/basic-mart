  <template>
    <AdminLayout ref="layout">
      <!-- Dynamic content based on current section -->
      <DashboardAnalytics 
        v-if="currentSection === 'dashboard' && isAdmin"
        @navigate-to-section="changeSection"
        ref="dashboardAnalytics"
      />
      
      <ProductsManagement 
        v-else-if="currentSection === 'products' && isAdmin" 
        @change-section="changeSection"
        @edit-product="editProduct"
        ref="productsManagement"
      />
      
      <OrdersManagement 
        v-else-if="currentSection === 'orders' && isAdmin"
        ref="ordersManagement"
      />
      
      <UserManagement 
        v-else-if="currentSection === 'users' && isAdmin"
        ref="userManagement"
      />
      
      <ProductForm 
        v-else-if="currentSection === 'add-product' && isAdmin" 
        :product-to-edit="productToEdit"
        @change-section="changeSection"
        @save-product="saveProduct"
      />
      
      <MyOrders 
        v-else-if="currentSection === 'my-orders'"
        @continue-shopping="goToShopping"
        ref="myOrders"
      />
      
      <AccountSettings 
        v-else-if="currentSection === 'account'" 
      />
      
      <!-- Fallback: show my orders for non-admin users -->
      <MyOrders v-else @continue-shopping="goToShopping" />
    </AdminLayout>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import AdminLayout from '@/components/admin/AdminLayout.vue';
  import DashboardAnalytics from '@/components/admin/DashboardAnalytics.vue';
  import ProductsManagement from '@/components/admin/ProductsManagement.vue';
  import OrdersManagement from '@/components/admin/OrdersManagement.vue';
  import UserManagement from '@/components/admin/UserManagement.vue';
  import ProductForm from '@/components/admin/ProductForm.vue';
  import AccountSettings from '@/components/admin/AccountSettings.vue';
  import MyOrders from '@/components/user/MyOrders.vue';

  const { isAdmin } = useAuth();

  // State
  const layout = ref(null);
  const productToEdit = ref(null);
  const productsManagement = ref(null);
  const dashboardAnalytics = ref(null);
  const userManagement = ref(null);
  const myOrders = ref(null);
  
  // Get current section from layout
  const currentSection = computed(() => {
    return layout.value?.currentSection || (isAdmin.value ? 'dashboard' : 'my-orders');
  });
  
  // Watch for changes to current section
  watch(() => currentSection.value, (newSection, oldSection) => {
    // Reset product to edit when navigating away from add-product
    if (newSection !== 'add-product') {
      productToEdit.value = null;
    }
    
    // Refresh data when returning to specific sections
    if (newSection === 'products' && oldSection === 'add-product' && productsManagement.value) {
      productsManagement.value.fetchProducts();
    }
    
    // Refresh analytics when returning to dashboard
    if (newSection === 'dashboard' && dashboardAnalytics.value) {
      dashboardAnalytics.value.fetchAnalytics();
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
    console.log('Product saved successfully:', product);
    // Clear the productToEdit to reset the form
    productToEdit.value = null;
    // Refresh the products list when we return to it
    if (productsManagement.value && layout.value?.currentSection === 'products') {
      productsManagement.value.fetchProducts();
    }
  };
  
  const goToShopping = () => {
    // Navigate to home page for shopping
    window.location.href = '/';
  };
  </script>