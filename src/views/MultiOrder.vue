<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore, type Task } from '../stores/task'
import CustomNavBar from '../components/CustomNavBar.vue'
import { toast } from '../utils/toast'

const router = useRouter()
const taskStore = useTaskStore()

// 加载状态
const loading = ref(false)

// 页面挂载时加载数据
onMounted(async () => {
  await fetchTasks()
})

// 刷新数据
const fetchTasks = async () => {
  loading.value = true
  try {
    await taskStore.fetchTasks()
    toast.success('加载成功')
  } catch (error) {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 计算所有进行中的订单（已接单和已取餐）
const ongoingTasks = computed(() => {
  return [...taskStore.acceptedTasks, ...taskStore.pickedTasks]
})

// 智能路线规划（简单实现，按距离排序）
const optimizedTasks = computed(() => {
  return [...ongoingTasks.value].sort((a, b) => {
    // 已取餐的订单优先
    if (a.status !== b.status) {
      return a.status === 'picked' ? -1 : 1
    }
    // 距离近的优先
    return a.distance - b.distance
  })
})

// 查看订单详情
const viewTaskDetail = (taskId: string) => {
  router.push(`/task/${taskId}`)
}

// 获取订单状态文本
const getStatusText = (status: Task['status']) => {
  switch (status) {
    case 'accepted': return '已接单'
    case 'picked': return '已取餐'
    default: return ''
  }
}

// 获取订单状态颜色
const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'accepted': return '#1989fa'
    case 'picked': return '#faad14'
    default: return '#969799'
  }
}

// 获取订单状态图标
const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'accepted': return 'location-o'
    case 'picked': return 'car'
    default: return 'clock-o'
  }
}
</script>

<template>
  <div class="multi-order-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="多订单管理">
      <template #right>
        <div @click="fetchTasks" class="refresh-btn">
          <van-icon name="replay" size="20" :loading="loading" color="#fff" />
        </div>
      </template>
    </CustomNavBar>

    <!-- 订单概览 -->
    <div class="order-overview">
      <div class="overview-card">
        <div class="overview-title">进行中订单</div>
        <div class="overview-count">{{ ongoingTasks.length }}</div>
      </div>
      <div class="overview-card">
        <div class="overview-title">预计总收入</div>
        <div class="overview-amount">¥{{ ongoingTasks.reduce((sum, task) => sum + task.fee, 0).toFixed(1) }}</div>
      </div>
    </div>

    <!-- 路线规划提示 -->
    <div class="route-tip">
      <van-icon name="info-o" size="16" color="#1989fa" />
      <span class="tip-text">已为您智能规划配送路线，优先配送已取餐和距离近的订单</span>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <van-skeleton :loading="loading" title :rows="5" animated>
        <van-empty 
          v-if="ongoingTasks.length === 0" 
          description="暂无进行中的订单" 
          image-size="100"
        >
          <template #bottom>
            <van-button type="primary" size="small" @click="fetchTasks">
              刷新订单
            </van-button>
          </template>
        </van-empty>
        <div v-else class="order-cards">
          <div 
            v-for="(task, index) in optimizedTasks" 
            :key="task.id"
            class="order-card"
            :class="`status-${task.status}`"
            @click="viewTaskDetail(task.id)"
          >
            <!-- 订单序号 -->
            <div class="order-index">
              <div class="index-badge">{{ index + 1 }}</div>
            </div>
            
            <!-- 订单内容 -->
            <div class="order-content">
              <div class="order-header">
                <div class="order-title-row">
                  <span class="order-title">{{ task.restaurantName }}</span>
                  <span class="order-status" :style="{ color: getStatusColor(task.status) }">
                    <van-icon :name="getStatusIcon(task.status)" size="14" />
                    {{ getStatusText(task.status) }}
                  </span>
                </div>
                <div class="order-fee">¥{{ task.fee.toFixed(1) }}</div>
              </div>
              
              <div class="order-body">
                <!-- 餐厅地址 -->
                <div class="address-section" v-if="task.status === 'accepted'">
                  <div class="address-header">
                    <van-icon name="shop-o" size="14" color="#1989fa" />
                    <span class="address-title">餐厅地址</span>
                  </div>
                  <div class="address-detail">{{ task.restaurantAddress }}</div>
                </div>
                
                <!-- 配送地址 -->
                <div class="address-section">
                  <div class="address-header">
                    <van-icon name="location-o" size="14" color="#07c160" />
                    <span class="address-title">配送地址</span>
                  </div>
                  <div class="address-detail">{{ task.deliveryAddress }}</div>
                </div>
              </div>
              
              <div class="order-footer">
                <div class="order-meta">
                  <span class="meta-item">
                    <van-icon name="distance" size="12" color="#999" />
                    {{ task.distance }}km
                  </span>
                  <span class="meta-item">
                    <van-icon name="clock-o" size="12" color="#999" />
                    {{ task.estimatedTime }}分钟
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-order-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 5rem;
  box-sizing: border-box;
}

/* 顶部导航栏*/
.custom-nav-bar {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  color: #fff;
}

.custom-nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

.refresh-btn {
  padding: 0 1rem;
  cursor: pointer;
}

/* 订单概览 */
.order-overview {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.overview-card {
  flex: 1;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.overview-title {
  font-size: 1.3rem;
  color: #969799;
  margin-bottom: 0.5rem;
}

.overview-count {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1989fa;
}

.overview-amount {
  font-size: 2.5rem;
  font-weight: 600;
  color: #07c160;
}

/* 路线规划提示 */
.route-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e6f7ff;
  color: #1989fa;
  padding: 1rem;
  margin: 0 1rem 1rem;
  border-radius: 8px;
  font-size: 1.3rem;
}

.tip-text {
  flex: 1;
  line-height: 1.5;
}

/* 订单列表 */
.order-list {
  padding: 0 1rem 1rem;
}

.order-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 订单卡片 */
.order-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  gap: 1rem;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.order-card.status-accepted {
  border-left: 4px solid #1989fa;
}

.order-card.status-picked {
  border-left: 4px solid #faad14;
}

/* 订单序号 */
.order-index {
  display: flex;
  align-items: flex-start;
}

.index-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #1989fa;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 订单内容 */
.order-content {
  flex: 1;
}

/* 订单头部 */
.order-header {
  margin-bottom: 1rem;
}

.order-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
}

.order-status {
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.order-fee {
  font-size: 1.8rem;
  font-weight: 600;
  color: #f5222d;
  text-align: right;
}

/* 订单主体 */
.order-body {
  margin-bottom: 1rem;
}

/* 地址部分 */
.address-section {
  margin-bottom: 1rem;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: #323233;
}

.address-detail {
  font-size: 1.3rem;
  color: #646566;
  line-height: 1.5;
  padding-left: 1.9rem;
}

/* 订单底部 */
.order-footer {
  padding-top: 1rem;
  border-top: 1px solid #ebedf0;
}

.order-meta {
  display: flex;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  color: #969799;
}
</style>
