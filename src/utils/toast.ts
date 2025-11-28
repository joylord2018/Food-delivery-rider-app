import { ref } from 'vue'

// Toast状态
const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')
const toastDuration = ref(2000)

// Toast配置
interface ToastConfig {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

// 显示Toast
const showToast = (config: string | ToastConfig) => {
  if (typeof config === 'string') {
    toastMessage.value = config
    toastType.value = 'info'
    toastDuration.value = 2000
  } else {
    toastMessage.value = config.message
    toastType.value = config.type || 'info'
    toastDuration.value = config.duration || 2000
  }
  toastVisible.value = true
}

// 关闭Toast
const closeToast = () => {
  toastVisible.value = false
}

// 便捷方法
const toast = {
  success: (message: string, duration?: number) => {
    showToast({ message, type: 'success', duration })
  },
  error: (message: string, duration?: number) => {
    showToast({ message, type: 'error', duration })
  },
  warning: (message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration })
  },
  info: (message: string, duration?: number) => {
    showToast({ message, type: 'info', duration })
  }
}

export {
  toastVisible,
  toastMessage,
  toastType,
  toastDuration,
  showToast,
  closeToast,
  toast
}