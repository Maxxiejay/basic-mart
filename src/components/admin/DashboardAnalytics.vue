<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
      <button @click="fetchAnalytics" class="text-sm text-gray-500 hover:text-gray-700">
        <RefreshCw class="h-4 w-4" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <AlertTriangle class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div v-if="!isLoading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Sales Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DollarSign class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                <dd class="text-lg font-medium text-gray-900">
                  ₦{{ formatCurrency(analytics.totalSales) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">
              <TrendingUp class="inline h-4 w-4 mr-1" />
              Revenue generated
            </span>
          </div>
        </div>
      </div>

      <!-- Total Orders Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ShoppingBag class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ analytics.totalOrders?.toLocaleString() || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-blue-600 font-medium">
              <Package class="inline h-4 w-4 mr-1" />
              Orders processed
            </span>
          </div>
        </div>
      </div>

      <!-- Total Users Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Users class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ analytics.totalUsers?.toLocaleString() || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-purple-600 font-medium">
              <UserPlus class="inline h-4 w-4 mr-1" />
              Registered users
            </span>
          </div>
        </div>
      </div>

      <!-- Total Products Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Package class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ analytics.totalProducts?.toLocaleString() || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-orange-600 font-medium">
              <Tag class="inline h-4 w-4 mr-1" />
              Items in catalog
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div v-if="!isLoading && !error" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            @click="navigateToSection('add-product')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle class="h-5 w-5 mr-2 text-gray-400" />
            Add Product
          </button>
          
          <button 
            @click="navigateToSection('orders')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ShoppingBag class="h-5 w-5 mr-2 text-gray-400" />
            View Orders
          </button>
          
          <button 
            @click="navigateToSection('users')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Users class="h-5 w-5 mr-2 text-gray-400" />
            Manage Users
          </button>
          
          <button 
            @click="navigateToSection('products')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Package class="h-5 w-5 mr-2 text-gray-400" />
            View Products
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity Summary -->
    <div v-if="!isLoading && !error" class="mt-8 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Overview</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Sales Performance -->
          <div class="border-l-4 border-green-400 pl-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Sales Performance</h4>
            <p class="text-2xl font-bold text-green-600">
              ₦{{ formatCurrency(analytics.totalSales) }}
            </p>
            <p class="text-sm text-gray-500">Total revenue generated</p>
          </div>
          
          <!-- Order Insights -->
          <div class="border-l-4 border-blue-400 pl-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Order Insights</h4>
            <p class="text-2xl font-bold text-blue-600">
              {{ analytics.totalOrders || 0 }}
            </p>
            <p class="text-sm text-gray-500">
              Average: ₦{{ calculateAverageOrderValue() }} per order
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  PlusCircle,
  UserPlus,
  Tag,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-vue-next';
import { getAdminDashboard } from '@/api';

const emit = defineEmits(['navigate-to-section']);

// State
const analytics = ref({
  totalSales: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalProducts: 0
});
const isLoading = ref(true);
const error = ref(null);

// Fetch analytics data
const fetchAnalytics = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getAdminDashboard();
    analytics.value = response.data || {
      totalSales: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0
    };
  } catch (err) {
    console.error('Failed to fetch analytics:', err);
    error.value = err.response?.data?.message || 'Failed to load dashboard analytics';
  } finally {
    isLoading.value = false;
  }
};

// Format currency with proper formatting
const formatCurrency = (amount) => {
  if (!amount) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Calculate average order value
const calculateAverageOrderValue = () => {
  if (!analytics.value.totalOrders || analytics.value.totalOrders === 0) {
    return '0.00';
  }
  const average = analytics.value.totalSales / analytics.value.totalOrders;
  return formatCurrency(average);
};

// Navigate to different sections
const navigateToSection = (sectionId) => {
  emit('navigate-to-section', sectionId);
};

// Load analytics on component mount
onMounted(() => {
  fetchAnalytics();
});

// Expose fetchAnalytics method for parent component
defineExpose({
  fetchAnalytics
});
</script>
