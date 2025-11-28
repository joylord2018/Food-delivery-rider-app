<template>
  <div class="countdown-timer" :class="{ 'warning': isWarning, 'danger': isDanger }">
    <div class="countdown-label">{{ label }}</div>
    <div class="countdown-time">
      <span class="time-part">{{ hours }}</span>
      <span class="time-separator">:</span>
      <span class="time-part">{{ minutes }}</span>
      <span class="time-separator">:</span>
      <span class="time-part">{{ seconds }}</span>
    </div>
    <div class="countdown-status" v-if="isExpired">已超时</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { toast } from '@/utils/toast'

interface Props {
  label: string
  targetTime: string // ISO格式时间字符串
  warningThreshold?: number // 警告阈值（秒）
  dangerThreshold?: number // 危险阈值（秒）
  autoStart?: boolean // 是否自动开始
  onExpire?: () => void // 超时回调
  onWarning?: () => void // 警告回调
  onDanger?: () => void // 危险回调
}

const props = withDefaults(defineProps<Props>(), {
  warningThreshold: 300, // 默认5分钟警告
  dangerThreshold: 60, // 默认1分钟危险
  autoStart: true,
  onExpire: () => {},
  onWarning: () => {},
  onDanger: () => {}
})

const isRunning = ref(props.autoStart)
const remainingSeconds = ref(0)
const hasWarned = ref(false)
const hasDangered = ref(false)

const calculateRemainingSeconds = () => {
  const now = new Date().getTime()
  const target = new Date(props.targetTime).getTime()
  return Math.max(0, Math.floor((target - now) / 1000))
}

const hours = computed(() => {
  const h = Math.floor(remainingSeconds.value / 3600)
  return h.toString().padStart(2, '0')
})

const minutes = computed(() => {
  const m = Math.floor((remainingSeconds.value % 3600) / 60)
  return m.toString().padStart(2, '0')
})

const seconds = computed(() => {
  const s = remainingSeconds.value % 60
  return s.toString().padStart(2, '0')
})

const isExpired = computed(() => remainingSeconds.value <= 0)
const isWarning = computed(() => {
  return remainingSeconds.value <= props.warningThreshold && remainingSeconds.value > props.dangerThreshold
})
const isDanger = computed(() => remainingSeconds.value <= props.dangerThreshold && remainingSeconds.value > 0)

let timer: number | null = null

const start = () => {
  if (!timer) {
    isRunning.value = true
    updateCountdown()
    timer = window.setInterval(updateCountdown, 1000)
  }
}

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    isRunning.value = false
  }
}

const reset = () => {
  stop()
  remainingSeconds.value = calculateRemainingSeconds()
  hasWarned.value = false
  hasDangered.value = false
  if (props.autoStart) {
    start()
  }
}

const updateCountdown = () => {
  remainingSeconds.value = calculateRemainingSeconds()
  
  // 检查警告状态
  if (isWarning.value && !hasWarned.value) {
    hasWarned.value = true
    props.onWarning()
    toast.warning(`${props.label}即将超时！`)
    // 震动提醒
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }
  
  // 检查危险状态
  if (isDanger.value && !hasDangered.value) {
    hasDangered.value = true
    props.onDanger()
    toast.error(`${props.label}即将超时！`)
    // 震动提醒
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500])
    }
  }
  
  // 检查超时
  if (isExpired.value && timer) {
    stop()
    props.onExpire()
    toast.error(`${props.label}已超时！`)
    // 震动提醒
    if ('vibrate' in navigator) {
      navigator.vibrate([1000])
    }
  }
}

watch(() => props.targetTime, () => {
  reset()
})

onMounted(() => {
  remainingSeconds.value = calculateRemainingSeconds()
  if (props.autoStart) {
    start()
  }
})

onUnmounted(() => {
  stop()
})

defineExpose({
  start,
  stop,
  reset
})
</script>

<style lang="scss" scoped>
.countdown-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.countdown-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.countdown-time {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
}

.time-part {
  background-color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-separator {
  margin: 0 4px;
  color: #999;
}

.countdown-status {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
}

.countdown-timer.warning {
  background-color: #fff7e6;
  border: 1px solid #ffd591;
}

.countdown-timer.warning .countdown-time {
  color: #fa8c16;
}

.countdown-timer.danger {
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  animation: pulse 1s infinite;
}

.countdown-timer.danger .countdown-time {
  color: #ff4d4f;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>