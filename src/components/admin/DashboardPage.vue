<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(stat, index) in stats" :key="index" class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{{ stat.name }}</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900 dark:text-white">{{ stat.value }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              View all
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
      <div class="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="(activity, index) in recentActivity" :key="index">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                  {{ activity.title }}
                </p>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="activity.statusColor">
                    {{ activity.status }}
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <component :is="activity.icon" class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {{ activity.description }}
                  </p>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  <p>
                    {{ activity.date }}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardLayout from '../../components/admin/DashboardLayout.vue';
import { getAdminDashboard } from '@/api';

// Stats data
const stats = ref([
  { name: 'Total Products', value: '0', icon: 'ShoppingBagIcon' },
  { name: 'Total Orders', value: '0', icon: 'ShoppingCartIcon' },
  { name: 'Total Customers', value: '0', icon: 'UsersIcon' },
  { name: 'Revenue', value: '$0', icon: 'CurrencyDollarIcon' },
]);

const isLoading = ref(true);
const error = ref(null);

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getAdminDashboard();
    const data = response.data;
    
    stats.value = [
      { name: 'Total Products', value: data.totalProducts?.toString() || '0', icon: 'ShoppingBagIcon' },
      { name: 'Total Orders', value: data.totalOrders?.toString() || '0', icon: 'ShoppingCartIcon' },
      { name: 'Total Customers', value: data.totalUsers?.toString() || '0', icon: 'UsersIcon' },
      { name: 'Revenue', value: `₦${data.totalSales?.toLocaleString() || '0'}`, icon: 'CurrencyDollarIcon' },
    ];
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    error.value = 'Failed to load dashboard data';
    // Keep default values on error
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboardData);

// Recent activity data
const recentActivity = ref([
  {
    title: 'New product added',
    description: 'Wireless Headphones',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    date: 'Today at 2:30 PM',
    icon: 'ShoppingBagIcon'
  },
  {
    title: 'Order #1234',
    description: 'Order processed',
    status: 'Processing',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    date: 'Today at 1:15 PM',
    icon: 'ShoppingCartIcon'
  },
  {
    title: 'Product updated',
    description: 'Smart Watch',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    date: 'Yesterday at 4:45 PM',
    icon: 'PencilIcon'
  },
  {
    title: 'Product deleted',
    description: 'Bluetooth Speaker',
    status: 'Completed',
    statusColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    date: 'Yesterday at 3:20 PM',
    icon: 'TrashIcon'
  },
]);
</script>