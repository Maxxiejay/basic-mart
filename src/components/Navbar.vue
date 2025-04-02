<template>
    <nav class=" text-white bg-gray-200 py-4 sticky top-0 z-50">
        <div class="bg-primary p-4 rounded-xl container mx-auto flex items-center justify-between">
            <!-- Left section: Menu and Logo -->
            <div class="flex items-center gap-3">
                <!-- <button class="p-1">
                    <MenuIcon class="h-6 w-6" />
                </button> -->
                <div class="flex items-center">
                    <span class="font-bold text-lg">🛒 BasicMart</span>
                </div>
            </div>

            <!-- Middle section: Search bar -->
            <div class="flex-1 mx-4 max-w-xl">
                <div class="relative">
                    <input type="text" placeholder="Search for Grocery, Stores, Vegetable or Meat"
                        class="w-full py-1.5 px-4 pr-10 rounded-full text-gray-800 text-sm" />
                    <button class="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <SearchIcon class="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            <!-- Right section: Order info, Cart, Profile -->
            <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center text-sm">
                    <BoltIcon class="h-5 w-5 text-accent mr-1" />
                    <span>Order now and get it within <span class="text-accent font-medium">15 mins!</span></span>
                </div>
                <button class="relative" @click="handleToggleCart">
                    <ShoppingCartIcon class="h-6 w-6" />
                    <span
                        class="absolute -top-1 -right-1 bg-accent text-teal-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">{{ totalItemsWithoutQuantity }}</span>
                </button>
                <!-- <div class="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
            <img src="/placeholder.svg?height=32&width=32" alt="User profile" class="h-full w-full object-cover" />
          </div> -->
            </div>
        </div>
    </nav>
</template>

<script setup>
import { MenuIcon, SearchIcon, ShoppingCartIcon, BoltIcon } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useCart } from '@/composables/useCart';

const { cartItems } = useCart(); // Access cartItems from the cart composable

// Compute the total number of items in the cart (ignoring quantity)
const totalItemsWithoutQuantity = computed(() => {
    return cartItems.value.length; // Count the number of unique items in the cart
});
const emit = defineEmits(['toggleCart']);

const handleToggleCart = () => {
    emit('toggleCart');
};
</script>

<style scoped>
nav {
    padding: 10px;
}
</style>