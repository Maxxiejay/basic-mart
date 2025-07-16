<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">User Management</h1>
      <div class="flex space-x-2">
        <button 
          @click="showCreateUserModal = true" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <UserPlus class="h-4 w-4 inline mr-2" />
          Add User
        </button>
        <button @click="fetchUsers" class="text-sm text-gray-500 hover:text-gray-700">
          <RefreshCw class="h-4 w-4" />
        </button>
      </div>
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

    <!-- Desktop Users Table -->
    <div v-if="!isLoading && !error && users.length > 0" class="hidden lg:block bg-white shadow overflow-hidden sm:rounded-md">
      <div class="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div class="min-w-max">
          <table class="w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  User ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Name & Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Orders
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Joined
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ user.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name || 'N/A' }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                    {{ user.role || 'user' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getUserLocation(user) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.Orders?.length || user.orderCount || 0 }} orders</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt || user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button @click="viewUser(user)" class="text-indigo-600 hover:text-indigo-900">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button 
                    @click="toggleUserRole(user)" 
                    :disabled="isUpdatingRole || user.id === currentUserId"
                    class="text-orange-600 hover:text-orange-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="user.id === currentUserId ? 'Cannot change your own role' : 'Toggle role'"
                  >
                    <UserCog class="h-4 w-4" />
                  </button>
                  <button 
                    @click="confirmDeleteUser(user)" 
                    :disabled="user.id === currentUserId"
                    class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="user.id === currentUserId ? 'Cannot delete your own account' : 'Delete user'"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Mobile Users Cards -->
    <div v-if="!isLoading && !error && users.length > 0" class="lg:hidden space-y-4">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="bg-white shadow overflow-hidden rounded-md p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium text-gray-900">#{{ user.id }}</div>
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
            :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
            {{ user.role || 'user' }}
          </span>
        </div>
        <div class="mb-2">
          <div class="text-sm font-medium text-gray-900">{{ user.name || 'N/A' }}</div>
          <div class="text-sm text-gray-500">{{ user.email }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>
            <div class="text-sm text-gray-900">{{ getUserLocation(user) }}</div>
            <div class="text-xs text-gray-500">{{ user.Orders?.length || user.orderCount || 0 }} orders</div>
          </div>
          <div class="text-xs text-gray-500">
            {{ formatDate(user.createdAt || user.created_at) }}
          </div>
        </div>
        <div class="mt-3 flex justify-end space-x-2">
          <button @click="viewUser(user)" class="text-indigo-600 hover:text-indigo-900">
            <Eye class="h-4 w-4" />
          </button>
          <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900">
            <Edit class="h-4 w-4" />
          </button>
          <button 
            @click="toggleUserRole(user)" 
            :disabled="isUpdatingRole || user.id === currentUserId"
            class="text-orange-600 hover:text-orange-900 disabled:opacity-50"
          >
            <UserCog class="h-4 w-4" />
          </button>
          <button 
            @click="confirmDeleteUser(user)" 
            :disabled="user.id === currentUserId"
            class="text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !error && users.length === 0" class="py-12 text-center bg-white shadow rounded-lg">
      <Users class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-800">No users</h3>
      <p class="mt-1 text-sm text-gray-500">No users found in the system.</p>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserModal && selectedUser" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeUserModal"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  User Details - {{ selectedUser.name || 'N/A' }}
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Basic Information</h4>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p><strong>ID:</strong> #{{ selectedUser.id }}</p>
                      <p><strong>Name:</strong> {{ selectedUser.name || 'N/A' }}</p>
                      <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                      <p><strong>Role:</strong> 
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ml-1"
                          :class="selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                          {{ selectedUser.role || 'user' }}
                        </span>
                      </p>
                      <p><strong>Joined:</strong> {{ formatDate(selectedUser.createdAt || selectedUser.created_at) }}</p>
                    </div>
                  </div>

                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p><strong>Phone:</strong> {{ selectedUser.phone || 'N/A' }}</p>
                      <p><strong>Address:</strong> {{ selectedUser.address || 'N/A' }}</p>
                      <p><strong>City:</strong> {{ selectedUser.city || 'N/A' }}</p>
                      <p><strong>State:</strong> {{ selectedUser.state || 'N/A' }}</p>
                      <p><strong>Country:</strong> {{ selectedUser.country || 'N/A' }}</p>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <h4 class="font-medium text-gray-900 mb-2">Order History</h4>
                  <div class="text-sm text-gray-600">
                    <p>Total Orders: {{ selectedUser.Orders?.length || selectedUser.orderCount || 0 }}</p>
                    <div v-if="selectedUser.Orders && selectedUser.Orders.length > 0" class="mt-2">
                      <div class="max-h-32 overflow-y-auto">
                        <div v-for="order in selectedUser.Orders.slice(0, 5)" :key="order.id" class="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                          <span>Order #{{ order.id }}</span>
                          <span>₦{{ order.total?.toFixed(2) || '0.00' }}</span>
                        </div>
                        <p v-if="selectedUser.Orders.length > 5" class="text-xs text-gray-500 mt-1">
                          ... and {{ selectedUser.Orders.length - 5 }} more orders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeUserModal" 
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateUserModal || showEditUserModal" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeModals"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="showCreateUserModal ? createUser() : updateUser()">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ showCreateUserModal ? 'Create New User' : 'Edit User' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                    v-model="userForm.name" 
                    type="text" 
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    v-model="userForm.email" 
                    type="email" 
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                
                <div v-if="showCreateUserModal">
                  <label class="block text-sm font-medium text-gray-700">Password</label>
                  <input 
                    v-model="userForm.password" 
                    type="password" 
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Role</label>
                  <select 
                    v-model="userForm.role"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    v-model="userForm.phone" 
                    type="tel"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Address</label>
                  <input 
                    v-model="userForm.address" 
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">City</label>
                    <input 
                      v-model="userForm.city" 
                      type="text"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">State</label>
                    <input 
                      v-model="userForm.state" 
                      type="text"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Country</label>
                    <input 
                      v-model="userForm.country" 
                      type="text"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ isSubmitting ? 'Saving...' : (showCreateUserModal ? 'Create User' : 'Update User') }}
              </button>
              <button 
                type="button"
                @click="closeModals" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="showDeleteModal = false"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete user "{{ userToDelete?.name || userToDelete?.email }}"? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteUser"
              :disabled="isDeleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button 
              @click="showDeleteModal = false" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  Users, 
  AlertTriangle, 
  Eye,
  Edit,
  Trash2,
  UserPlus,
  UserCog,
  RefreshCw
} from 'lucide-vue-next';
import { 
  getAllUsersAdmin, 
  createUserAdmin, 
  updateUserAdmin, 
  deleteUserAdmin, 
  toggleUserRoleAdmin 
} from '@/api';
import { useAuth } from '@/composables/useAuth';

const { user: currentUser } = useAuth();

// State
const users = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showUserModal = ref(false);
const showCreateUserModal = ref(false);
const showEditUserModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref(null);
const userToDelete = ref(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isUpdatingRole = ref(false);

// Current user ID for restrictions
const currentUserId = computed(() => currentUser.value?.id);

// User form data
const userForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: ''
});

// Fetch users from backend
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await getAllUsersAdmin();
    users.value = response.data || [];
  } catch (err) {
    console.error('Failed to fetch users:', err);
    error.value = err.response?.data?.message || 'Failed to load users';
  } finally {
    isLoading.value = false;
  }
};

// Get user location string
const getUserLocation = (user) => {
  const location = [user.city, user.state, user.country].filter(Boolean).join(', ');
  return location || 'N/A';
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// View user details
const viewUser = (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

// Close user modal
const closeUserModal = () => {
  showUserModal.value = false;
  selectedUser.value = null;
};

// Reset user form
const resetUserForm = () => {
  userForm.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: ''
  };
};

// Edit user
const editUser = (user) => {
  userForm.value = {
    name: user.name || '',
    email: user.email || '',
    password: '', // Don't prefill password
    role: user.role || 'user',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    country: user.country || ''
  };
  selectedUser.value = user;
  showEditUserModal.value = true;
};

// Close all modals
const closeModals = () => {
  showCreateUserModal.value = false;
  showEditUserModal.value = false;
  selectedUser.value = null;
  resetUserForm();
};

// Create user
const createUser = async () => {
  try {
    isSubmitting.value = true;
    await createUserAdmin(userForm.value);
    await fetchUsers();
    closeModals();
    alert('User created successfully');
  } catch (err) {
    console.error('Failed to create user:', err);
    alert(err.response?.data?.message || 'Failed to create user');
  } finally {
    isSubmitting.value = false;
  }
};

// Update user
const updateUser = async () => {
  try {
    isSubmitting.value = true;
    const { password, ...updateData } = userForm.value;
    // Only include password if it's provided
    if (password) {
      updateData.password = password;
    }
    await updateUserAdmin(selectedUser.value.id, updateData);
    await fetchUsers();
    closeModals();
    alert('User updated successfully');
  } catch (err) {
    console.error('Failed to update user:', err);
    alert(err.response?.data?.message || 'Failed to update user');
  } finally {
    isSubmitting.value = false;
  }
};

// Confirm delete user
const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Delete user
const deleteUser = async () => {
  try {
    isDeleting.value = true;
    await deleteUserAdmin(userToDelete.value.id);
    await fetchUsers();
    showDeleteModal.value = false;
    userToDelete.value = null;
    alert('User deleted successfully');
  } catch (err) {
    console.error('Failed to delete user:', err);
    alert(err.response?.data?.message || 'Failed to delete user');
  } finally {
    isDeleting.value = false;
  }
};

// Toggle user role
const toggleUserRole = async (user) => {
  if (isUpdatingRole.value || user.id === currentUserId.value) return;
  
  try {
    isUpdatingRole.value = true;
    await toggleUserRoleAdmin(user.id);
    await fetchUsers();
    alert(`User role updated successfully`);
  } catch (err) {
    console.error('Failed to toggle user role:', err);
    alert(err.response?.data?.message || 'Failed to update user role');
  } finally {
    isUpdatingRole.value = false;
  }
};

// Load users on component mount
onMounted(() => {
  fetchUsers();
});

// Expose fetchUsers method for parent component
defineExpose({
  fetchUsers
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
