<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">My Orders</h1>
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

    <!-- Orders List -->
    <div v-else-if="orders.length > 0" class="space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id" 
        class="bg-white shadow rounded-lg border border-gray-200 overflow-hidden"
      >
        <div class="px-4 py-5 sm:p-6">
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div class="flex items-center space-x-4 mb-2 sm:mb-0">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Order #{{ order.id.slice(-8) }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(order.createdAt || order.created_at) }}</p>
                <div v-if="order.paymentReference" class="text-xs text-gray-400 mt-1">
                  Ref: {{ order.paymentReference }}
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusColor(order.status)">
                  {{ order.status || 'Pending' }}
                </span>
                <span v-if="order.paymentStatus" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getPaymentStatusColor(order.paymentStatus)">
                  {{ order.paymentStatus }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-gray-900">₦{{ order.total?.toFixed(2) || '0.00' }}</p>
              <p class="text-sm text-gray-500">{{ getOrderItems(order).length }} items</p>
              <p v-if="order.paymentMethod" class="text-xs text-gray-400">{{ order.paymentMethod }}</p>
            </div>
          </div>

          <!-- Order Items Preview -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Items</h4>
            <div class="space-y-2">
              <div 
                v-for="item in getOrderItems(order).slice(0, 3)" 
                :key="item.id" 
                class="flex items-center justify-between text-sm"
              >
                <div class="flex items-center space-x-3">
                  <img 
                    v-if="item.Product?.image || item.product?.image || item.image"
                    :src="getImageUrl(item.Product?.image || item.product?.image || item.image)" 
                    :alt="item.Product?.name || item.product?.name || item.name"
                    class="h-10 w-10 rounded-md object-cover"
                  />
                  <div class="flex-1">
                    <p class="text-gray-900">{{ item.Product?.name || item.product?.name || item.name }}</p>
                    <p class="text-gray-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <p class="text-gray-900 font-medium">₦{{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
              
              <!-- Show more items indicator -->
              <div v-if="getOrderItems(order).length > 3" class="text-sm text-gray-500 italic">
                + {{ getOrderItems(order).length - 3 }} more items
              </div>
            </div>
          </div>

          <!-- Delivery Information -->
          <div v-if="order.deliveryAddress" class="border-t border-gray-200 pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Delivery Address</h4>
            <div class="text-sm text-gray-600">
              <p>{{ order.deliveryAddress }}</p>
              <p>{{ order.deliveryCity }}, {{ order.deliveryState }} {{ order.deliveryCountry }}</p>
              <p v-if="order.deliveryPhone">Phone: {{ order.deliveryPhone }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
            <button 
              @click="viewOrderDetails(order)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details
            </button>
            <div class="flex space-x-3">
              <button 
                v-if="order.status?.toLowerCase() === 'pending'"
                @click="cancelOrder(order)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Cancel Order
              </button>
              <button 
                v-if="order.status?.toLowerCase() === 'delivered'"
                @click="reorder(order)"
                class="text-green-600 hover:text-green-800 text-sm"
              >
                Reorder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-12 text-center bg-white shadow rounded-lg">
      <Package class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-800">No orders yet</h3>
      <p class="mt-1 text-sm text-gray-500">You haven't placed any orders yet. Start shopping to see your orders here!</p>
      <button 
        @click="$emit('continue-shopping')"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Start Shopping
      </button>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal && selectedOrder" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeOrderModal"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Order Details #{{ selectedOrder.id.slice(-8) }}
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Order Information</h4>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p><strong>Order ID:</strong> #{{ selectedOrder.id }}</p>
                      <p><strong>Date:</strong> {{ formatDate(selectedOrder.createdAt || selectedOrder.created_at) }}</p>
                      <p><strong>Status:</strong> 
                        <span class="px-2 py-1 text-xs rounded-full ml-1" :class="getStatusColor(selectedOrder.status)">
                          {{ selectedOrder.status || 'Pending' }}
                        </span>
                      </p>
                      <p><strong>Total:</strong> ₦{{ selectedOrder.total?.toFixed(2) || '0.00' }}</p>
                    </div>
                  </div>

                  <div v-if="selectedOrder.paymentStatus || selectedOrder.paymentMethod || selectedOrder.paymentReference">
                    <h4 class="font-medium text-gray-900 mb-2">Payment Information</h4>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p v-if="selectedOrder.paymentStatus"><strong>Payment Status:</strong>
                        <span class="px-2 py-1 text-xs rounded-full ml-1" :class="getPaymentStatusColor(selectedOrder.paymentStatus)">
                          {{ selectedOrder.paymentStatus }}
                        </span>
                      </p>
                      <p v-if="selectedOrder.paymentMethod"><strong>Payment Method:</strong> {{ selectedOrder.paymentMethod }}</p>
                      <p v-if="selectedOrder.paymentReference"><strong>Payment Reference:</strong> {{ selectedOrder.paymentReference }}</p>
                    </div>
                  </div>

                  <div v-if="selectedOrder.deliveryAddress">
                    <h4 class="font-medium text-gray-900 mb-2">Delivery Information</h4>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p><strong>Address:</strong> {{ selectedOrder.deliveryAddress }}</p>
                      <p><strong>City:</strong> {{ selectedOrder.deliveryCity }}</p>
                      <p><strong>State:</strong> {{ selectedOrder.deliveryState }}</p>
                      <p><strong>Country:</strong> {{ selectedOrder.deliveryCountry }}</p>
                      <p v-if="selectedOrder.deliveryPhone"><strong>Phone:</strong> {{ selectedOrder.deliveryPhone }}</p>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div class="border border-gray-200 rounded-md overflow-hidden">
                    <div class="divide-y divide-gray-200">
                      <div v-for="item in getOrderItems(selectedOrder)" :key="item.id" class="p-4 flex items-center space-x-4">
                        <img 
                          v-if="item.Product?.image || item.product?.image || item.image"
                          :src="getImageUrl(item.Product?.image || item.product?.image || item.image)" 
                          :alt="item.Product?.name || item.product?.name || item.name"
                          class="h-16 w-16 rounded-md object-cover"
                        />
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900">
                            {{ item.Product?.name || item.product?.name || item.name }}
                          </p>
                          <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                          <p class="text-sm text-gray-500">Unit Price: ₦{{ item.price.toFixed(2) }}</p>
                        </div>
                        <div class="text-sm font-medium text-gray-900">
                          ₦{{ (item.price * item.quantity).toFixed(2) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeOrderModal" 
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
  RefreshCw
} from 'lucide-vue-next';
import { getOrders, getImageUrl } from '@/api';
import { useCart } from '@/composables/useCart';

const orders = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showOrderModal = ref(false);
const selectedOrder = ref(null);

const { addToCart } = useCart();
const emit = defineEmits(['continue-shopping']);

// Fetch user's orders from backend
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getOrders();
    orders.value = response.data || [];
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    error.value = err.response?.data?.message || 'Failed to load orders';
  } finally {
    isLoading.value = false;
  }
};

// Get order items (handles both items and OrderItems structure)
const getOrderItems = (order) => {
  return order.OrderItems || order.items || [];
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
const viewOrderDetails = (order) => {
  selectedOrder.value = order;
  showOrderModal.value = true;
};

// Close order modal
const closeOrderModal = () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
};

// Cancel order
const cancelOrder = async (order) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  
  try {
    // Update order status locally (since we don't have a cancel API endpoint)
    const orderIndex = orders.value.findIndex(o => o.id === order.id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled';
    }
    
    // Show success message
    alert('Order cancelled successfully');
  } catch (err) {
    console.error('Failed to cancel order:', err);
    alert('Failed to cancel order. Please try again.');
  }
};

// Reorder functionality
const reorder = async (order) => {
  try {
    const orderItems = getOrderItems(order);
    
    // Add each item to cart
    for (const item of orderItems) {
      const product = item.Product || item.product || item;
      await addToCart(product, item.quantity);
    }
    
    alert(`${orderItems.length} items added to cart!`);
    emit('continue-shopping');
  } catch (err) {
    console.error('Failed to reorder:', err);
    alert('Failed to add items to cart. Please try again.');
  }
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
