<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// Props
const props = defineProps<{
  visible: boolean
  message: string
  duration?: number
  type?: 'success' | 'error' | 'warning' | 'info'
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// Local visible state
const isVisible = ref(props.visible)

// Watch for prop changes
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    startTimer()
  }
})

// Watch for local visible changes
watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
})

// Timer
let timer: number | null = null

// Start timer to hide toast
const startTimer = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = window.setTimeout(() => {
    isVisible.value = false
  }, props.duration || 2000)
}

// Clear timer on unmount
onMounted(() => {
  if (props.visible) {
    startTimer()
  }
})

// Get icon based on type
const getIcon = () => {
  switch (props.type) {
    case 'success':
      return 'success'
    case 'error':
      return 'close-circle'
    case 'warning':
      return 'warning-o'
    case 'info':
      return 'info-o'
    default:
      return 'info-o'
  }
}

// Get color based on type
const getColor = () => {
  switch (props.type) {
    case 'success':
      return '#07c160'
    case 'error':
      return '#ee0a24'
    case 'warning':
      return '#faad14'
    case 'info':
      return '#1989fa'
    default:
      return '#1989fa'
  }
}
</script>

<template>
  <div v-if="isVisible" class="custom-toast" :style="{ backgroundColor: getColor() }">
    <van-icon :name="getIcon()" size="18" color="#fff" class="toast-icon" />
    <span class="toast-message">{{ message }}</span>
  </div>
</template>

<style lang="scss" scoped>
.custom-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 24px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: toastFadeIn 0.3s ease;
}

@keyframes toastFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.toast-icon {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.toast-message {
  white-space: nowrap;
}
</style>
