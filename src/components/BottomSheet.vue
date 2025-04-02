<template>
    <div id="bottom-sheet" class="fixed z-30 bottom-0 left-0 right-0" @click.self="toggleSheet" v-if="modelValue">
        <Transition name="slide-in-out" appear>
            <div class="absolute w-full max-w-[500px] bottom-0 right-0 bg-white shadow-lg rounded-t-xl p-4 h-[60vh]">
                <div class="w-full font-semibold text-xl text-center">{{ title }}</div>
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'Bottom Sheet',
    },
});

const emit = defineEmits(['update:modelValue']);

const toggleSheet = () => {
    emit('update:modelValue', !props.modelValue);
};

// Close on escape key
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false);
  }
};

// Add and remove event listener
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  } else {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  }
}, { immediate: true });
</script>

<style scoped>
#bottom-sheet {
    background-color: rgba(0, 0, 0, 0.3);
    height: 100vh;
}

.slide-in-out-enter-active,
.slide-in-out-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-in-out-enter-from,
.slide-in-out-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.slide-in-out-enter-to,
.slide-in-out-leave-from {
    transform: translateY(0);
    opacity: 1;
}
</style>