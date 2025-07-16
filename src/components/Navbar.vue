<template>
    <nav class=" text-white bg-gray-200 py-4 sticky top-0 z-50">
        <div class="bg-primary p-4 rounded-xl container mx-auto flex items-center justify-between">
            <!-- Left section: Menu and Logo -->
            <div class="flex items-center gap-3">
                <!-- <button class="p-1">
                    <MenuIcon class="h-6 w-6" />
                </button> -->
                <div class="flex items-center cursor-pointer" v-show="showName" @click="router.push('/')">
                    <span class="font-bold text-lg">🛒 BasicMart</span>
                </div>
            </div>

            <!-- Middle section: Search bar -->
            <div class="flex-1 mx-4 max-w-xl">
                <div class="relative">
                    <input 
                        @focus="showName = false" 
                        @blur="showName = true" 
                        @keyup.enter="handleSearch"
                        v-model="searchQuery"
                        type="search" 
                        placeholder="Search for Grocery, Stores, Vegetable or Meat"
                        class="w-full py-1.5 px-4 pr-10 rounded-full text-gray-800 text-sm transition-all" 
                    />
                    <button @click="handleSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <SearchIcon class="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            <!-- Right section: Order info, Cart, Profile -->
            <div class="flex items-center gap-2 md:gap-4">
                <div class="hidden md:flex items-center text-sm">
                    <Zap class="h-5 w-5 text-accent mr-1" />
                    <span>Order now and get it within <span class="text-accent font-medium">15 mins!</span></span>
                </div>
                <button class="relative" @click="handleToggleCart">
                    <ShoppingCartIcon class="h-6 w-6" />
                    <span
                        class="absolute -top-1 -right-1 bg-accent text-teal-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">{{
                        totalItemsWithoutQuantity }}</span>
                </button>
                
                <!-- User Profile/Login -->
                <div class="relative">
                    <div v-if="isAuthenticated" class="flex items-center gap-2">
                        <span class="hidden md:inline text-sm">Hello, {{ user?.name }}</span>
                        <div @click="toggleUserMenu" class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer">
                            <CircleUserRound />
                        </div>
                        
                        <!-- User dropdown menu -->
                        <div v-if="showUserMenu" class="absolute right-0 top-10 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48 z-50">
                            <router-link to="/dashboard" class="block px-4 py-2 hover:bg-gray-100">Dashboard</router-link>
                            <!-- <router-link to="/orders" class="block px-4 py-2 hover:bg-gray-100">My Orders</router-link> -->
                            <hr class="my-1">
                            <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                        </div>
                    </div>
                    <div v-else class="flex items-center gap-2">
                        <router-link to="/login" class="text-sm hover:text-accent">Login</router-link>
                        <span class="text-sm">/</span>
                        <router-link to="/register" class="text-sm hover:text-accent">Register</router-link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { MenuIcon, SearchIcon, ShoppingCartIcon, Zap, CircleUserRound } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useCart } from '@/composables/useCart';
import { useAuth } from '@/composables/useAuth';
import router from '@/router';

const { cartItems } = useCart();
const { user, isAuthenticated, isAdmin, logout } = useAuth();

const showName = ref(true);
const showUserMenu = ref(false);
const searchQuery = ref('');

// Compute the total number of items in the cart (ignoring quantity)
const totalItemsWithoutQuantity = computed(() => {
    return cartItems.value.length;
});

const emit = defineEmits(['toggleCart']);

const handleToggleCart = () => {
    emit('toggleCart');
};

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
    await logout();
    showUserMenu.value = false;
    router.push('/');
};

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ 
            name: 'home', 
            query: { search: searchQuery.value.trim() } 
        });
    }
};

const goToAdmin = () => {
    router.push({ name: 'admin' });
};
</script>

<style scoped>
nav {
    padding: 10px;
}
</style>