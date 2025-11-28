<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomToast from './components/CustomToast.vue'
import { toastVisible, toastMessage, toastType, toastDuration } from './utils/toast'

const route = useRoute()
const router = useRouter()

// 检查当前页面是否需要显示底部导航栏
const showTabbar = computed(() => {
  const tabbarRoutes = ['home', 'earnings', 'order-history', 'settings']
  return tabbarRoutes.includes(route.name as string)
})

// 当前激活的标签
const activeTab = ref(route.name as string || 'home')

// 监听路由变化，更新激活标签
watch(() => route.name, (newName) => {
  if (newName) {
    activeTab.value = newName as string
  }
}, { immediate: true })

// 处理标签切换
  const handleTabChange = (name: string) => {
    activeTab.value = name
    // 手动处理路由跳转
    const routeMap: Record<string, string> = {
      home: '/home',
      earnings: '/earnings',
      'order-history': '/order-history',
      settings: '/settings'
    }
    const path = routeMap[name]
    if (path && route.path !== path) {
      router.push(path)
    }
  }
</script>

<template>
  <div class="app-container">
    <!-- 路由出口容器 -->
    <div class="router-view-container">
      <router-view></router-view>
    </div>
    
    <!-- 底部导航栏 -->
    <van-tabbar v-if="showTabbar" v-model="activeTab" @change="handleTabChange">
      <van-tabbar-item name="home" icon="home-o" to="/home">
        首页
      </van-tabbar-item>
      <van-tabbar-item name="earnings" icon="bill-o" to="/earnings">
        收益
      </van-tabbar-item>
      <van-tabbar-item name="order-history" icon="orders-o" to="/order-history">
        订单
      </van-tabbar-item>
      <van-tabbar-item name="settings" icon="setting-o" to="/settings">
        设置
      </van-tabbar-item>
    </van-tabbar>
    
    <!-- 全局Toast组件 -->
    <CustomToast
      v-model:visible="toastVisible"
      :message="toastMessage"
      :type="toastType"
      :duration="toastDuration"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 确保路由出口占据剩余空间，允许内部滚动
:deep(.router-view-container) {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>