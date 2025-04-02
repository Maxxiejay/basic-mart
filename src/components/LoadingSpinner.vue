<template>
  <div class="loading-spinner">
    <div :class="spinnerClass"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'medium', // default size
    validator: value => ['small', 'medium', 'large'].includes(value),
  },
});

const spinnerClass = computed(() => {
  return {
    spinner: true,
    'spinner-small': props.size === 'small',
    'spinner-medium': props.size === 'medium',
    'spinner-large': props.size === 'large',
  };
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Full height to cover the container */
}

.spinner {
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary); /* Vue.js green color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border-top-color: white;
}

.spinner-medium {
  width: 50px;
  height: 50px;
}

.spinner-large {
  width: 70px;
  height: 70px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>