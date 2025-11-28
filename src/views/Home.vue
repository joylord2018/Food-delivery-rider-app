<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '../stores/task'

import { useNotificationStore } from '../stores/notification'
import { toast } from '../utils/toast'


import CustomDialog from '../components/CustomDialog.vue'

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
    <van-nav-bar title="首页" class="custom-nav-bar">
      <template #right>
        <van-icon
          name="bell-o"
          size="20"
          class="notification-icon"
          @click="$router.push('/notification-center')"
        />
        <van-badge :content="notificationStore.unreadCount" class="notification-badge" />
      </template>
    </van-nav-bar>

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
.home-container {
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 固定标签页 */
.fixed-tabs {
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  margin: 0 1rem;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.task-tabs {
  background-color: #fff;
}

.task-tabs :deep(.van-tabs__nav) {
  background-color: #fff;
}

.task-tabs :deep(.van-tab) {
  font-size: 1.4rem;
  font-weight: 500;
}

.task-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
  height: 3px;
  width: 30px;
}

/* 可滚动任务内容 */
.scrollable-tasks {
  flex: 1;
  overflow: auto;
  padding: 0 1rem 1rem;
  margin-top: -1px; /* 消除与标签页的间隙 */
}

.tab-content {
  background-color: #fff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 任务列表 */
.task-list {
  padding: 1rem;
  overflow: visible;
}

/* 顶部导航栏 */
.custom-nav-bar {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  color: #fff;
  position: relative;
}

.custom-nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

.notification-icon {
  color: #fff;
  margin-right: 1rem;
  position: relative;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: 5px;
}

/* 在线状态切换 */
.online-status-section {
  padding: 1rem;
}

.status-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.status-info {
  flex: 1;
}

.status-text {
  font-size: 1.6rem;
  font-weight: 600;
  color: #323233;
  margin-bottom: 0.5rem;
}

.status-desc {
  font-size: 1.3rem;
  color: #969799;
  line-height: 1.4;
}

.status-switch {
  margin-left: 1rem;
}

/* 紧急求助按钮 */
.emergency-section {
  padding: 0 1rem 1rem;
}

.emergency-btn {
  border-radius: 25px;
  font-weight: 600;
  padding: 1rem 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #f5222d 0%, #ff7875 100%);
  border: none;
}

/* 任务列表 */
.tasks-section {
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  margin: 0 1rem 1rem;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.task-tabs {
  background-color: #fff;
}

.task-tabs :deep(.van-tabs__nav) {
  background-color: #fff;
}

.task-tabs :deep(.van-tab) {
  font-size: 1.4rem;
  font-weight: 500;
}

.task-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
  height: 3px;
  width: 30px;
}

.task-list {
  padding: 1rem;
}

.task-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.task-id {
  font-size: 1.3rem;
  color: #646566;
}

.task-status {
  padding: 0.4rem 1rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
}

.task-status.pending {
  background-color: #faad14;
}

.task-status.accepted {
  background-color: #1989fa;
}

.task-status.picked {
  background-color: #52c41a;
}

.task-status.delivered {
  background-color: #8c8c8c;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.task-info {
  flex: 1;
  margin-right: 1rem;
}

.task-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.task-time {
  font-size: 1.3rem;
  color: #969799;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-countdown {
  font-size: 1.3rem;
  color: #f5222d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.price-label {
  font-size: 1.3rem;
  color: #969799;
}

.price-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: #f5222d;
}

.task-actions {
  margin-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .task-content {
    flex-direction: column;
    gap: 1rem;
  }

  .task-price {
    align-items: flex-start;
  }
}
</style>