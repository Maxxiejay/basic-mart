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
            <h3 class="text-lg font-medium text-gray-900">Delivery Information</h3>
            <p class="mt-1 text-sm text-gray-500">Update your delivery address and contact information for orders.</p>
            
            <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <!-- Street Address -->
              <div class="sm:col-span-6">
                <label for="address" class="block text-sm font-medium text-gray-700">Street Address</label>
                <div class="mt-1">
                  <input
                    type="text"
                    id="address"
                    v-model="deliveryInfo.address"
                    placeholder="123 Main Street"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- City -->
              <div class="sm:col-span-6 md:col-span-2">
                <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                <div class="mt-1">
                  <input
                    type="text"
                    id="city"
                    v-model="deliveryInfo.city"
                    placeholder="New York"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- State -->
              <div class="sm:col-span-6 md:col-span-2">
                <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
                <div class="mt-1">
                  <input
                    type="text"
                    id="state"
                    v-model="deliveryInfo.state"
                    placeholder="NY"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- Postal Code -->
              <div class="sm:col-span-6 md:col-span-2">
                <label for="postal-code" class="block text-sm font-medium text-gray-700">Postal Code</label>
                <div class="mt-1">
                  <input
                    type="text"
                    id="postal-code"
                    v-model="deliveryInfo.postalCode"
                    placeholder="10001"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- Country -->
              <div class="sm:col-span-6 md:col-span-3">
                <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                <div class="mt-1">
                  <select
                    id="country"
                    v-model="deliveryInfo.country"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="NG">Nigeria</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <!-- Delivery Phone -->
              <div class="sm:col-span-6 md:col-span-3">
                <label for="delivery-phone" class="block text-sm font-medium text-gray-700">Delivery Phone</label>
                <div class="mt-1">
                  <input
                    type="tel"
                    id="delivery-phone"
                    v-model="deliveryInfo.phone"
                    placeholder="(555) 123-4567"
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- Delivery Instructions -->
              <div class="sm:col-span-6">
                <label for="instructions" class="block text-sm font-medium text-gray-700">Delivery Instructions</label>
                <div class="mt-1">
                  <textarea
                    id="instructions"
                    v-model="deliveryInfo.instructions"
                    rows="3"
                    placeholder="Leave at front door, ring doorbell, etc."
                    class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
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
              :disabled="isLoading"
              class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { User } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { getProfile, updateProfile } from '@/api';

const { user } = useAuth();

// Profile data
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  avatar: null
});

// Delivery information
const deliveryInfo = ref({
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
  instructions: ''
});

// Password form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

// Loading states
const isLoading = ref(false);

// Load profile and delivery info on mount
onMounted(async () => {
  await loadProfile();
});

const loadProfile = async () => {
  try {
    if (user.value) {
      // Use data from auth composable if available
      profile.value = {
        firstName: user.value.firstName || '',
        lastName: user.value.lastName || '',
        email: user.value.email || '',
        phone: user.value.phone || '',
        role: user.value.role || '',
        avatar: user.value.avatar || null
      };
      
      // Also load delivery info from user data
      deliveryInfo.value = {
        address: user.value.address || '',
        city: user.value.city || '',
        state: user.value.state || '',
        postalCode: user.value.postalCode || '',
        country: user.value.country || '',
        phone: user.value.deliveryPhone || user.value.phone || '',
        instructions: user.value.instructions || ''
      };
    } else {
      // Fallback to API call
      const response = await getProfile();
      profile.value = {
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        role: response.data.role || '',
        avatar: response.data.avatar || null
      };
      
      // Load delivery info from profile response
      deliveryInfo.value = {
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        postalCode: response.data.postalCode || '',
        country: response.data.country || '',
        phone: response.data.deliveryPhone || response.data.phone || '',
        instructions: response.data.instructions || ''
      };
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};

// Methods
const saveProfile = async () => {
  try {
    isLoading.value = true;
    
    // Combine profile and delivery information in one update
    const updateData = {
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      email: profile.value.email,
      phone: profile.value.phone,
      // Delivery information
      address: deliveryInfo.value.address,
      city: deliveryInfo.value.city,
      state: deliveryInfo.value.state,
      postalCode: deliveryInfo.value.postalCode,
      country: deliveryInfo.value.country,
      deliveryPhone: deliveryInfo.value.phone,
      instructions: deliveryInfo.value.instructions
    };

    await updateProfile(updateData);
    
    // If password fields are filled, update password
    if (passwordForm.value.current && passwordForm.value.new && passwordForm.value.confirm) {
      if (passwordForm.value.new === passwordForm.value.confirm) {
        await updateProfile({
          currentPassword: passwordForm.value.current,
          newPassword: passwordForm.value.new
        });
        
        // Reset password fields
        passwordForm.value = {
          current: '',
          new: '',
          confirm: ''
        };
      } else {
        alert('New password and confirmation do not match');
        return;
      }
    }
    
    // Show success message
    alert('Profile and delivery information updated successfully!');
  } catch (error) {
    console.error('Failed to save profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>