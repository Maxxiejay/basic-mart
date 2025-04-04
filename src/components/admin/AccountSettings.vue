<template>
  <div>
    <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-lg leading-6 font-medium text-gray-900">Profile Information</h2>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Update your account details and preferences.</p>
      </div>
      
      <div class="border-t border-gray-200">
        <form @submit.prevent="saveProfile" class="p-4 sm:p-6">
          <!-- Profile Photo -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">Profile Photo</label>
            <div class="mt-2 flex items-center">
              <span class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <img v-if="profile.avatar" :src="profile.avatar" alt="Profile photo" class="h-full w-full object-cover" />
                <User v-else class="h-full w-full text-gray-300 p-2" />
              </span>
              <button
                type="button"
                class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Change
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Name -->
            <div class="sm:col-span-6 md:col-span-3">
              <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="first-name"
                  v-model="profile.firstName"
                  class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-6 md:col-span-3">
              <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="last-name"
                  v-model="profile.lastName"
                  class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="sm:col-span-6 md:col-span-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input
                  id="email"
                  type="email"
                  v-model="profile.email"
                  class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Phone Number -->
            <div class="sm:col-span-6 md:col-span-3">
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
              <div class="mt-1">
                <input
                  type="tel"
                  id="phone"
                  v-model="profile.phone"
                  class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Role -->
            <div class="sm:col-span-6 md:col-span-3">
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="role"
                  v-model="profile.role"
                  disabled
                  class="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-200 mt-6">
            <h3 class="text-lg font-medium text-gray-900">Password</h3>
            <p class="mt-1 text-sm text-gray-500">Update your password.</p>
            
            <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-6 md:col-span-3">
                <label for="current-password" class="block text-sm font-medium text-gray-700">Current password</label>
                <div class="mt-1">
                  <input
                    type="password"
                    id="current-password"
                    v-model="passwordForm.current"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-6 md:col-span-3">
                <label for="new-password" class="block text-sm font-medium text-gray-700">New password</label>
                <div class="mt-1">
                  <input
                    type="password"
                    id="new-password"
                    v-model="passwordForm.new"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-6 md:col-span-3">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm password</label>
                <div class="mt-1">
                  <input
                    type="password"
                    id="confirm-password"
                    v-model="passwordForm.confirm"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { User } from 'lucide-vue-next';

// Profile data
const profile = ref({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  phone: '(555) 123-4567',
  role: 'Administrator',
  avatar: 'https://via.placeholder.com/150'
});

// Password form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

// Methods
const saveProfile = () => {
  // In a real app, this would send data to an API
  console.log('Saving profile:', profile.value);
  
  // If password fields are filled, update password
  if (passwordForm.value.current && passwordForm.value.new && passwordForm.value.confirm) {
    if (passwordForm.value.new === passwordForm.value.confirm) {
      console.log('Updating password');
      // Reset password fields
      passwordForm.value = {
        current: '',
        new: '',
        confirm: ''
      };
    } else {
      alert('New password and confirmation do not match');
    }
  }
  
  // Show success message
  alert('Profile updated successfully!');
};
</script>