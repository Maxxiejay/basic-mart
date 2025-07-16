<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Loading State -->
        <div v-if="isProcessing" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-900">Verifying Payment...</h2>
          <p class="text-gray-600">Please wait while we confirm your payment.</p>
        </div>

        <!-- Success State -->
        <div v-else-if="paymentStatus === 'success'" class="space-y-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Payment Successful!</h2>
          <p class="text-gray-600">Your order has been placed successfully.</p>
          <div v-if="orderDetails" class="bg-green-50 border border-green-200 rounded-md p-4 text-left">
            <h3 class="font-medium text-green-800 mb-2">Order Details</h3>
            <p class="text-sm text-green-700">Order ID: #{{ orderDetails.id }}</p>
            <p class="text-sm text-green-700">Total: ₦{{ orderDetails.total?.toFixed(2) }}</p>
            <p class="text-sm text-green-700">Payment Reference: {{ paymentReference }}</p>
          </div>
          <div class="space-y-2">
            <button 
              @click="goToOrders"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View My Orders
            </button>
            <button 
              @click="goToHome"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <!-- Failed State -->
        <div v-else-if="paymentStatus === 'failed'" class="space-y-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle class="h-8 w-8 text-red-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Payment Failed</h2>
          <p class="text-gray-600">{{ errorMessage || 'Your payment could not be processed.' }}</p>
          <div class="space-y-2">
            <button 
              @click="retryPayment"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Retry Payment
            </button>
            <button 
              @click="goToCart"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Cart
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="space-y-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <AlertTriangle class="h-8 w-8 text-yellow-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Payment Status Unknown</h2>
          <p class="text-gray-600">We couldn't verify your payment status. Please contact support if you were charged.</p>
          <div class="space-y-2">
            <button 
              @click="checkAgain"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Check Again
            </button>
            <button 
              @click="goToHome"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-vue-next';
import { useCart } from '@/composables/useCart';

const route = useRoute();
const router = useRouter();
const { verifyPaymentAndCompleteOrder } = useCart();

const isProcessing = ref(true);
const paymentStatus = ref(null);
const errorMessage = ref('');
const orderDetails = ref(null);
const paymentReference = ref('');

const verifyPayment = async () => {
  try {
    isProcessing.value = true;
    
    // Get reference from URL parameters or localStorage
    const reference = route.query.reference || localStorage.getItem('paymentReference');
    
    if (!reference) {
      paymentStatus.value = 'failed';
      errorMessage.value = 'No payment reference found';
      return;
    }

    paymentReference.value = reference;
    
    const result = await verifyPaymentAndCompleteOrder(reference);
    
    if (result.success) {
      paymentStatus.value = 'success';
      orderDetails.value = result.order;
    } else {
      paymentStatus.value = 'failed';
      errorMessage.value = result.error || 'Payment verification failed';
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    paymentStatus.value = 'failed';
    errorMessage.value = 'An error occurred while verifying payment';
  } finally {
    isProcessing.value = false;
  }
};

const retryPayment = () => {
  // Go back to cart to retry checkout
  router.push('/');
};

const goToCart = () => {
  router.push('/');
};

const goToOrders = () => {
  router.push('/dashboard');
};

const goToHome = () => {
  router.push('/');
};

const checkAgain = () => {
  verifyPayment();
};

onMounted(() => {
  verifyPayment();
});
</script>
