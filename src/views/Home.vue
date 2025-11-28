<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '../stores/task'

import { useNotificationStore } from '../stores/notification'
import { toast } from '../utils/toast'


import CustomDialog from '../components/CustomDialog.vue'
import CustomNavBar from '../components/CustomNavBar.vue'

const taskStore = useTaskStore()

const notificationStore = useNotificationStore()

// 加载状态
const loading = ref(false)
const refreshing = ref(false)
const offline = ref(false)

// 弹窗状态
const dialogVisible = ref(false)
const dialogConfig = ref({
  title: '',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  type: 'default' as 'default' | 'confirm' | 'warning' | 'danger',
  onConfirm: () => {}
})

// 显示弹窗
const showDialog = (config: {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'confirm' | 'warning' | 'danger'
  onConfirm: () => void
}) => {
  dialogConfig.value = {
    title: config.title,
    message: config.message,
    confirmText: config.confirmText || '确定',
    cancelText: config.cancelText || '取消',
    type: config.type || 'default',
    onConfirm: config.onConfirm
  }
  dialogVisible.value = true
}

// 处理弹窗确认
const handleDialogConfirm = () => {
  dialogConfig.value.onConfirm()
  dialogVisible.value = false
}



// 刷新任务列表
const refreshTasks = async () => {
  refreshing.value = true
  try {
    await taskStore.fetchTasks()
    toast.success('刷新成功')
  } catch (error) {
    toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

// 页面挂载时加载数据
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      taskStore.fetchTasks(),
      notificationStore.fetchNotifications()
    ])
  } catch (error) {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
})

// 接受任务
const acceptTask = (taskId: string) => {
  showDialog({
    title: '接受任务',
    message: '确定要接受这个任务吗？',
    type: 'confirm',
    onConfirm: async () => {
      try {
        await taskStore.acceptTask(taskId)
        toast.success('任务已接受')
      } catch (error) {
        toast.error('接受失败，请重试')
      }
    }
  })
}

// 取餐
const pickUpTask = (taskId: string) => {
  showDialog({
    title: '确认取餐',
    message: '确定已经取餐了吗？',
    type: 'confirm',
    onConfirm: async () => {
      try {
        await taskStore.pickTask(taskId)
        toast.success('取餐成功')
      } catch (error) {
        toast.error('取餐失败，请重试')
      }
    }
  })
}

// 送达
const deliverTask = (taskId: string) => {
  showDialog({
    title: '确认送达',
    message: '确定已经送达了吗？',
    type: 'confirm',
    onConfirm: async () => {
      try {
        await taskStore.completeTask(taskId)
        toast.success('送达成功')
      } catch (error) {
        toast.error('送达失败，请重试')
      }
    }
  })
}



// 切换在线状态
const toggleOnlineStatus = () => {
  offline.value = !offline.value
  if (offline.value) {
    showDialog({
      title: '确认下线',
      message: '下线后将无法接收新任务，确定要下线吗？',
      type: 'warning',
      onConfirm: () => {
        toast.success('已切换为离线状态')
      }
    })
  } else {
    toast.success('已切换为在线状态')
  }
}

// 紧急求助
const emergencyHelp = () => {
  showDialog({
    title: '紧急求助',
    message: '确定要发送紧急求助信息吗？',
    type: 'danger',
    confirmText: '立即发送',
    onConfirm: async () => {
      try {
        toast.success('紧急求助信息已发送')
      } catch (error) {
        toast.error('发送失败，请重试')
      }
    }
  })
}

// 计算属性
const pendingTasks = computed(() => taskStore.pendingTasks)
const acceptedTasks = computed(() => taskStore.acceptedTasks)
const pickedTasks = computed(() => taskStore.pickedTasks)
const deliveredTasks = computed(() => taskStore.deliveredTasks)

// 当前激活的标签
const activeTab = ref('pending')
</script>

<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <CustomNavBar title="首页" show-back="false">
      <template #right>
        <van-icon
          name="bell-o"
          size="20"
          class="notification-icon"
          @click="$router.push('/notification-center')"
        />
        <van-badge :content="notificationStore.unreadCount" class="notification-badge" />
      </template>
    </CustomNavBar>

    <!-- 在线状态切换 -->
    <div class="online-status-section">
      <div class="status-card">
        <div class="status-info">
          <div class="status-text">{{ offline ? '离线' : '在线' }}</div>
          <div class="status-desc">{{ offline ? '已切换为离线状态，无法接收新任务' : '已切换为在线状态，可以接收新任务' }}</div>
        </div>
        <van-switch
          v-model="offline"
          @change="toggleOnlineStatus"
          size="24px"
          class="status-switch"
        />
      </div>
    </div>

    <!-- 紧急求助按钮 -->
    <div class="emergency-section">
      <van-button
        type="danger"
        block
        size="large"
        @click="emergencyHelp"
        class="emergency-btn"
      >
        <van-icon name="warning-o" size="20" style="margin-right: 8px" />
        紧急求助
      </van-button>
    </div>

    <!-- 固定标签页 -->
    <div class="fixed-tabs">
      <van-tabs v-model:active="activeTab" class="task-tabs">
        <van-tab title="待接任务" name="pending" />
        <van-tab title="已接任务" name="accepted" />
        <van-tab title="已取餐" name="picked" />
        <van-tab title="已完成" name="delivered" />
      </van-tabs>
    </div>

    <!-- 可滚动任务内容 -->
    <div class="scrollable-tasks">
      <!-- 待接任务 -->
      <div v-show="activeTab === 'pending'" class="tab-content">
        <van-pull-refresh v-model="refreshing" @refresh="refreshTasks">
          <div class="task-list">
            <van-empty
              v-if="pendingTasks.length === 0"
              description="暂无待接任务"
              image-size="100"
            >
              <template #bottom>
                <van-button type="primary" size="small" @click="refreshTasks">
                  刷新任务
                </van-button>
              </template>
            </van-empty>
            <div
              v-for="task in pendingTasks"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <div class="task-id">订单号：{{ task.id }}</div>
                <div class="task-status pending">待接任务</div>
              </div>
              <div class="task-content">
                <div class="task-info">
                  <div class="task-title">{{ task.restaurantName }}</div>
                  <div class="task-time">
                    <van-icon name="clock-o" size="14" />
                    <span>{{ task.createTime }}</span>
                  </div>
                </div>
                <div class="task-price">
                  <span class="price-label">配送费</span>
                  <span class="price-value">¥{{ task.fee }}</span>
                </div>
              </div>
              <div class="task-actions">
                <van-button
                  type="primary"
                  block
                  @click="acceptTask(task.id)"
                  size="small"
                >
                  接受任务
                </van-button>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </div>

      <!-- 已接任务 -->
      <div v-show="activeTab === 'accepted'" class="tab-content">
        <van-pull-refresh v-model="refreshing" @refresh="refreshTasks">
          <div class="task-list">
            <van-empty
              v-if="acceptedTasks.length === 0"
              description="暂无已接任务"
              image-size="100"
            />
            <div
              v-for="task in acceptedTasks"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <div class="task-id">订单号：{{ task.id }}</div>
                <div class="task-status accepted">已接任务</div>
              </div>
              <div class="task-content">
                <div class="task-info">
                  <div class="task-title">{{ task.restaurantName }}</div>
                  <div class="task-time">
                    <van-icon name="clock-o" size="14" />
                    <span>{{ task.createTime }}</span>
                  </div>
                  <div class="task-countdown">
                    <van-icon name="time-o" size="14" />
                    <span>预计送达时间：{{ new Date(task.expectedDeliveryTime).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="task-price">
                  <span class="price-label">配送费</span>
                  <span class="price-value">¥{{ task.fee }}</span>
                </div>
              </div>
              <div class="task-actions">
                <van-button
                  type="primary"
                  block
                  @click="pickUpTask(task.id)"
                  size="small"
                >
                  前往取餐
                </van-button>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </div>

      <!-- 已取餐 -->
      <div v-show="activeTab === 'picked'" class="tab-content">
        <van-pull-refresh v-model="refreshing" @refresh="refreshTasks">
          <div class="task-list">
            <van-empty
              v-if="pickedTasks.length === 0"
              description="暂无已取餐任务"
              image-size="100"
            />
            <div
              v-for="task in pickedTasks"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <div class="task-id">订单号：{{ task.id }}</div>
                <div class="task-status picked">已取餐</div>
              </div>
              <div class="task-content">
                <div class="task-info">
                  <div class="task-title">{{ task.restaurantName }}</div>
                  <div class="task-time">
                    <van-icon name="clock-o" size="14" />
                    <span>{{ task.createTime }}</span>
                  </div>
                  <div class="task-countdown">
                    <van-icon name="time-o" size="14" />
                    <span>预计送达时间：{{ new Date(task.expectedDeliveryTime).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="task-price">
                  <span class="price-label">配送费</span>
                  <span class="price-value">¥{{ task.fee }}</span>
                </div>
              </div>
              <div class="task-actions">
                <van-button
                  type="primary"
                  block
                  @click="deliverTask(task.id)"
                  size="small"
                >
                  确认送达
                </van-button>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </div>

      <!-- 已完成 -->
      <div v-show="activeTab === 'delivered'" class="tab-content">
        <van-pull-refresh v-model="refreshing" @refresh="refreshTasks">
          <div class="task-list">
            <van-empty
              v-if="deliveredTasks.length === 0"
              description="暂无已完成任务"
              image-size="100"
            />
            <div
              v-for="task in deliveredTasks"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <div class="task-id">订单号：{{ task.id }}</div>
                <div class="task-status delivered">已完成</div>
              </div>
              <div class="task-content">
                <div class="task-info">
                  <div class="task-title">{{ task.restaurantName }}</div>
                  <div class="task-time">
                    <van-icon name="clock-o" size="14" />
                    <span>{{ task.createTime }}</span>
                  </div>
                </div>
                <div class="task-price">
                  <span class="price-label">配送费</span>
                  <span class="price-value">¥{{ task.fee }}</span>
                </div>
              </div>
              <div class="task-actions">
                <van-button
                  type="default"
                  block
                  @click="$router.push(`/task-detail/${task.id}`)"
                  size="small"
                >
                  查看详情
                </van-button>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </div>
    </div>
  </div>

  <!-- 自定义弹窗组件 -->
  <CustomDialog
    v-model:visible="dialogVisible"
    :title="dialogConfig.title"
    :message="dialogConfig.message"
    :confirm-text="dialogConfig.confirmText"
    :cancel-text="dialogConfig.cancelText"
    :type="dialogConfig.type"
    @confirm="handleDialogConfirm"
    @cancel="dialogVisible = false"
  />
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.home-container {
  height: 100%;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 通知图标 */
.notification-icon {
  color: #fff;
  margin-right: $spacing-lg;
  position: relative;
  cursor: pointer;
  transition: all $transition-base;
  
  &:hover {
    transform: scale(1.1);
  }
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: $font-size-xs;
}

/* 在线状态切换 */
.online-status-section {
  padding: $spacing-lg;
}

.status-card {
  background-color: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }
}

.status-info {
  flex: 1;
}

.status-text {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $text-color;
  margin-bottom: $spacing-xs;
}

.status-desc {
  font-size: $font-size-md;
  color: $text-color-secondary;
  line-height: $line-height-base;
}

.status-switch {
  margin-left: $spacing-lg;
  
  :deep(.van-switch__node) {
    width: 24px;
    height: 24px;
  }
  
  :deep(.van-switch__background) {
    width: 50px;
    height: 28px;
  }
}

/* 紧急求助按钮 */
.emergency-section {
  padding: 0 $spacing-lg $spacing-lg;
}

.emergency-btn {
  border-radius: $border-radius-full;
  font-weight: $font-weight-semibold;
  padding: $spacing-lg 0;
  font-size: $font-size-lg;
  background: linear-gradient(135deg, $danger-color 0%, rgba(255, 77, 79, 0.9) 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(245, 34, 45, 0.3);
  transition: all $transition-base;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(245, 34, 45, 0.4);
    transform: translateY(-2px);
  }
}

/* 固定标签页 */
.fixed-tabs {
  background-color: $white;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  margin: 0 $spacing-lg;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.task-tabs {
  background-color: $white;
  
  :deep(.van-tabs__nav) {
    background-color: $white;
  }
  
  :deep(.van-tab) {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $text-color-secondary;
  }
  
  :deep(.van-tab--active) {
    color: $primary-color;
  }
  
  :deep(.van-tabs__line) {
    background-color: $primary-color;
    height: 3px;
    width: 30px;
    border-radius: 2px;
  }
}

/* 可滚动任务内容 */
.scrollable-tasks {
  flex: 1;
  overflow: auto;
  padding: 0 $spacing-lg $spacing-lg;
  margin-top: -1px; /* 消除与标签页的间隙 */
}

.tab-content {
  background-color: $white;
  border-radius: 0 0 $border-radius-lg $border-radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
}

/* 任务列表 */
.task-list {
  padding: $spacing-lg;
  overflow: visible;
}

.task-card {
  background-color: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  border: 1px solid $border-color-light;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.task-id {
  font-size: $font-size-md;
  color: $text-color-secondary;
}

.task-status {
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $white;
}

.task-status.pending {
  background-color: $warning-color;
}

.task-status.accepted {
  background-color: $primary-color;
}

.task-status.picked {
  background-color: $success-color;
}

.task-status.delivered {
  background-color: $text-color-tertiary;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-xl;
}

.task-info {
  flex: 1;
  margin-right: $spacing-lg;
}

.task-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-color;
  margin-bottom: $spacing-md;
  line-height: $line-height-base;
}

.task-time {
  font-size: $font-size-md;
  color: $text-color-secondary;
  margin-bottom: $spacing-xs;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.task-countdown {
  font-size: $font-size-md;
  color: $danger-color;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.task-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $spacing-xs;
}

.price-label {
  font-size: $font-size-md;
  color: $text-color-secondary;
}

.price-value {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $danger-color;
}

.task-actions {
  margin-top: $spacing-lg;
}

/* 响应式设计 */
@media (max-width: $breakpoint-sm) {
  .task-content {
    flex-direction: column;
    gap: $spacing-lg;
  }

  .task-price {
    align-items: flex-start;
  }
  
  .status-card {
    padding: $spacing-lg;
  }
  
  .task-card {
    padding: $spacing-lg;
  }
}

@media (max-width: $breakpoint-xs) {
  .online-status-section,
  .emergency-section,
  .scrollable-tasks {
    padding: $spacing-md;
  }
  
  .fixed-tabs {
    margin: 0 $spacing-md;
  }
}
</style>