<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 组件属性
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: [Boolean, String],
    default: true,
    validator: (value) => {
      if (typeof value === 'string') {
        return value === 'true' || value === 'false'
      }
      return typeof value === 'boolean'
    }
  },
  bgColor: {
    type: String,
    default: 'linear-gradient(135deg, #1989fa 0%, #36cfc9 100%)'
  },
  textColor: {
    type: String,
    default: '#fff'
  },
  useDefaultBack: {
    type: Boolean,
    default: true
  }
})

// 事件
const emit = defineEmits(['click-left', 'click-right'])

// 处理返回按钮点击
const handleBack = () => {
  // 发出事件
  emit('click-left')
  // 只有当useDefaultBack为true时，才执行默认的返回行为
  if (props.useDefaultBack) {
    router.back()
  }
}

// 计算样式
const navBarStyle = computed(() => {
  return {
    backgroundColor: props.bgColor,
    color: props.textColor
  }
})
</script>

<template>
  <van-nav-bar
    :title="title"
    :left-arrow="showBack === true || showBack === 'true'"
    @click-left="handleBack"
    @click-right="$emit('click-right')"
    :style="navBarStyle"
    class="custom-nav-bar"
  >
    <slot name="right"></slot>
  </van-nav-bar>
</template>

<style lang="scss" scoped>
.custom-nav-bar {
  // 统一的导航栏样式
  
  :deep(.van-nav-bar__title) {
    color: inherit;
    font-weight: 600;
  }
  
  :deep(.van-nav-bar__left) {
    color: inherit;
  }
  
  :deep(.van-icon-arrow-left) {
    color: inherit;
    font-size: 18px;
  }
  
  :deep(.van-nav-bar__right) {
    color: inherit;
  }
}
</style>