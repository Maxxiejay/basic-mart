<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Orders</h1>
      <button @click="fetchOrders" class="text-sm text-gray-500 hover:text-gray-700">
        <RefreshCw class="h-4 w-4" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <AlertTriangle class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Desktop Orders Table -->
    <div v-if="!isLoading && !error && orders.length > 0" class="hidden lg:block bg-white shadow overflow-hidden sm:rounded-md">
      <div class="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div class="min-w-max">
          <table class="w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Order ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Delivery Location
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Payment
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.User?.name || order.User?.email || 'Guest' }}</div>
                <div class="text-sm text-gray-500">{{ order.User?.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.items?.length || order.OrderItems?.length || 0 }} items</div>
                <div class="text-sm text-gray-500">
                  {{ getOrderItemsPreview(order) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">₦{{ order.total?.toFixed(2) || '0.00' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.deliveryCity }}, {{ order.deliveryState }}</div>
                <div class="text-sm text-gray-500">{{ order.deliveryCountry }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select 
                  :value="order.status || 'pending'"
                  @change="updateStatus(order.id, $event.target.value)"
                  :disabled="isUpdatingStatus"
                  class="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="order.paymentStatus" class="flex flex-col space-y-1">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getPaymentStatusColor(order.paymentStatus)">
                    {{ order.paymentStatus }}
                  </span>
                  <div v-if="order.paymentMethod" class="text-xs text-gray-500">{{ order.paymentMethod }}</div>
                  <div v-if="order.paymentReference" class="text-xs text-gray-400">{{ order.paymentReference.slice(-8) }}</div>
                </div>
                <div v-else class="text-xs text-gray-400">No payment info</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt || order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewOrder(order)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                  <Eye class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <!-- Mobile Orders Cards -->
    <div v-if="!isLoading && !error && orders.length > 0" class="lg:hidden space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="bg-white shadow overflow-hidden rounded-md p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
          <select 
            :value="order.status || 'pending'"
            @change="updateStatus(order.id, $event.target.value)"
            :disabled="isUpdatingStatus"
            class="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="text-sm text-gray-500 mb-2">
          {{ order.user?.name || order.user?.email || 'Guest' }}
        </div>
        <div class="flex justify-between items-center">
          <div>
            <div class="text-sm text-gray-900">₦{{ order.total?.toFixed(2) || '0.00' }}</div>
            <div class="text-xs text-gray-500">{{ order.items?.length || order.OrderItems?.length || 0 }} items</div>
            <div class="text-xs text-gray-500">{{ order.deliveryCity }}, {{ order.deliveryState }}</div>
            <div v-if="order.paymentStatus" class="flex items-center space-x-2 mt-1">
              <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getPaymentStatusColor(order.paymentStatus)">
                {{ order.paymentStatus }}
              </span>
              <span v-if="order.paymentMethod" class="text-xs text-gray-400">{{ order.paymentMethod }}</span>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            {{ formatDate(order.createdAt || order.created_at) }}
          </div>
        </div>
        <div class="mt-2 flex justify-end">
          <button @click="viewOrder(order)" class="text-indigo-600 hover:text-indigo-900">
            <Eye class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !error && orders.length === 0" class="py-12 text-center bg-white shadow rounded-lg">
      <Package class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-800">No orders</h3>
      <p class="mt-1 text-sm text-gray-500">No orders have been placed yet.</p>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal && selectedOrder" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeOrderModal"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Order #{{ selectedOrder.id }}
                </h3>
                
                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <p class="text-sm text-gray-600">{{ selectedOrder.user?.name || selectedOrder.user?.email || 'Guest' }}</p>
                  <p class="text-sm text-gray-600">{{ selectedOrder.user?.email }}</p>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div v-for="item in getOrderItems(selectedOrder)" :key="item.id" class="flex justify-between text-sm mb-1">
                    <span>{{ item.Product?.name || item.product?.name || item.name }} x{{ item.quantity }}</span>
                    <span>₦{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Delivery Information</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <p><strong>Address:</strong> {{ selectedOrder.deliveryAddress }}</p>
                    <p><strong>City:</strong> {{ selectedOrder.deliveryCity }}</p>
                    <p><strong>State:</strong> {{ selectedOrder.deliveryState }}</p>
                    <p><strong>Country:</strong> {{ selectedOrder.deliveryCountry }}</p>
                    <p><strong>Phone:</strong> {{ selectedOrder.deliveryPhone }}</p>
                  </div>
                </div>

                <div v-if="selectedOrder.paymentStatus || selectedOrder.paymentMethod || selectedOrder.paymentReference" class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Payment Information</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <p v-if="selectedOrder.paymentStatus"><strong>Payment Status:</strong>
                      <span class="px-2 py-1 text-xs font-semibold rounded-full ml-1" :class="getPaymentStatusColor(selectedOrder.paymentStatus)">
                        {{ selectedOrder.paymentStatus }}
                      </span>
                    </p>
                    <p v-if="selectedOrder.paymentMethod"><strong>Payment Method:</strong> {{ selectedOrder.paymentMethod }}</p>
                    <p v-if="selectedOrder.paymentReference"><strong>Payment Reference:</strong> {{ selectedOrder.paymentReference }}</p>
                  </div>
                </div>

                <div class="mb-4 pt-2 border-t">
                  <div class="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₦{{ selectedOrder.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Update Status</h4>
                  <select 
                    :value="selectedOrder.status || 'pending'"
                    @change="updateStatus(selectedOrder.id, $event.target.value)"
                    :disabled="isUpdatingStatus"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <p v-if="isUpdatingStatus" class="text-sm text-gray-500 mt-1">Updating status...</p>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">Current Status</h4>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusColor(selectedOrder.status)">
                    {{ selectedOrder.status || 'Pending' }}
                  </span>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Order Date</h4>
                  <p class="text-sm text-gray-600">{{ formatDate(selectedOrder.createdAt || selectedOrder.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeOrderModal" 
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  Package, 
  AlertTriangle, 
  Eye,
  RefreshCw
} from 'lucide-vue-next';
import { getAllOrdersAdmin, updateOrderStatus } from '@/api';

const orders = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showOrderModal = ref(false);
const selectedOrder = ref(null);
const isUpdatingStatus = ref(false);

// Fetch orders from backend
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getAllOrdersAdmin();
    orders.value = response.data || [];
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    error.value = err.response?.data?.message || 'Failed to load orders';
  } finally {
    isLoading.value = false;
  }
};

// Update order status
const updateStatus = async (orderId, newStatus) => {
  if (isUpdatingStatus.value) return;
  
  try {
    isUpdatingStatus.value = true;
    await updateOrderStatus(orderId, newStatus);
    
    // Update the local order status
    const orderIndex = orders.value.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus;
    }
    
    // Update selected order if it's the one being updated
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      selectedOrder.value.status = newStatus;
    }
    
    // Show success message or notification here if desired
    console.log(`Order #${orderId} status updated to ${newStatus}`);
  } catch (err) {
    console.error('Failed to update order status:', err);
    // Optionally show error message to user
    alert(err.response?.data?.message || 'Failed to update order status');
  } finally {
    isUpdatingStatus.value = false;
  }
};

// Get order items (handles both items and OrderItems structure)
const getOrderItems = (order) => {
  return order.OrderItems || order.items || [];
};

// Get order items preview for table
const getOrderItemsPreview = (order) => {
  const items = getOrderItems(order);
  const preview = items.slice(0, 2).map(item => item.Product?.name || item.product?.name || item.name).join(', ');
  return items.length > 2 ? `${preview}...` : preview;
};

// Get status color class
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'paid':
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

// Get payment status color class
const getPaymentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// View order details
const viewOrder = (order) => {
  selectedOrder.value = order;
  showOrderModal.value = true;
};

// Close order modal
const closeOrderModal = () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
};

// Load orders on component mount
onMounted(() => {
  fetchOrders();
});

// Expose fetchOrders method for parent component
defineExpose({
  fetchOrders
});
</script>

<style scoped>
/* Custom scrollbar styling for better visibility */
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Add a subtle shadow to indicate scrollable content */
.overflow-x-auto {
  position: relative;
}

.overflow-x-auto::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overflow-x-auto:hover::after {
  opacity: 1;
}
</style>
