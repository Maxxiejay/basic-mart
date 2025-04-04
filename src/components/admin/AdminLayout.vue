<template>
  <div class="container mx-auto flex flex-col md:flex-row min-h-screen bg-gray-50 rounded-xl overflow-hidden mx-[10px]">
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden" 
      @click="isSidebarOpen = false"
    ></div>
    
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Sidebar Content -->
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center h-16 px-6 border-b border-gray-200">
          <ShoppingBag class="h-6 w-6 text-gray-700" />
          <span class="ml-2 text-lg font-medium text-gray-900">Admin Panel</span>
          <!-- Close button for mobile -->
          <button 
            @click="isSidebarOpen = false" 
            class="ml-auto p-1 rounded-md text-gray-500 md:hidden"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 py-4 pt-10 overflow-y-auto">
          <div class="space-y-1">
            <button
              v-for="item in navigation"
              :key="item.name"
              @click="navigateTo(item.id)"
              class="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md"
              :class="currentSection === item.id 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5" />
              {{ item.name }}
            </button>
          </div>
        </nav>
        
        <!-- User Info -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <img class="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="User avatar" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">Admin User</p>
              <button @click="navigateTo('account')" class="text-xs text-gray-500 hover:text-gray-700">
                Manage Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile sidebar toggle -->
    <div class="fixed bottom-4 right-4 md:hidden z-40">
      <button 
        @click="isSidebarOpen = !isSidebarOpen" 
        class="p-3 rounded-full bg-gray-800 text-white shadow-lg"
      >
        <Menu v-if="!isSidebarOpen" class="h-6 w-6" />
        <X v-else class="h-6 w-6" />
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 w-full">
      <div class="p-4 sm:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  ShoppingBag, 
  Package, 
  PlusCircle, 
  User, 
  Menu, 
  X 
} from 'lucide-vue-next';

// Navigation items
const navigation = [
  { id: 'products', name: 'Products', icon: Package },
  { id: 'add-product', name: 'Add Product', icon: PlusCircle },
  { id: 'account', name: 'Account', icon: User },
];

// Current section
const currentSection = ref('products');

// Mobile sidebar state
const isSidebarOpen = ref(false);

// Navigation method
const navigateTo = (sectionId) => {
  currentSection.value = sectionId;
  // Close sidebar on mobile after navigation
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

// Expose current section to parent
defineExpose({ currentSection });
</script>