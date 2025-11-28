<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
const props = defineProps<{
  visible: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'confirm' | 'warning' | 'danger'
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Local visible state
const isVisible = ref(props.visible)

// Watch for prop changes
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

// Watch for local visible changes
watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
})

// Close dialog
const closeDialog = () => {
  isVisible.value = false
}

// Confirm action
const confirmAction = () => {
  closeDialog()
  emit('confirm')
}

// Cancel action
const cancelAction = () => {
  closeDialog()
  emit('cancel')
}

// Get button color based on type
const getButtonColor = () => {
  switch (props.type) {
    case 'confirm':
      return '#1989fa'
    case 'warning':
      return '#faad14'
    case 'danger':
      return '#f5222d'
    default:
      return '#1989fa'
  }
}
</script>

<template>
  <div v-if="isVisible" class="custom-dialog-overlay" @click="closeDialog">
    <div class="custom-dialog" @click.stop>
      <!-- Dialog Title -->
      <div v-if="title" class="dialog-title">{{ title }}</div>
      
      <!-- Dialog Content -->
      <div class="dialog-content">{{ message }}</div>
      
      <!-- Dialog Buttons -->
      <div class="dialog-buttons">
        <button 
          v-if="cancelText" 
          class="dialog-btn cancel"
          @click="cancelAction"
        >
          {{ cancelText }}
        </button>
        <button 
          class="dialog-btn confirm"
          :style="{ backgroundColor: getButtonColor() }"
          @click="confirmAction"
        >
          {{ confirmText || '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.custom-dialog {
  background-color: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: dialogFadeIn 0.3s ease;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #323233;
  padding: 1.5rem 1.5rem 1rem;
  text-align: center;
}

.dialog-content {
  font-size: 1.4rem;
  color: #646566;
  padding: 0 1.5rem 1.5rem;
  text-align: center;
  line-height: 1.6;
}

.dialog-buttons {
  display: flex;
  border-top: 1px solid #ebedf0;
}

.dialog-btn {
  flex: 1;
  padding: 1.2rem;
  border: none;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dialog-btn.cancel {
  background-color: #fff;
  color: #969799;
  border-right: 1px solid #ebedf0;
}

.dialog-btn.cancel:hover {
  background-color: #fafafa;
}

.dialog-btn.confirm {
  color: #fff;
}

.dialog-btn.confirm:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
