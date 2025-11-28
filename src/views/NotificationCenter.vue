<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotificationStore, type Notification } from '../stores/notification'
import { toast } from '../utils/toast'

const notificationStore = useNotificationStore()

// 加载状�?
const loading = ref(false)
const refreshing = ref(false)

// 筛选条�?
const activeTab = ref('all')
const tabs = [
  { name: 'all', title: '全部' },
  { name: 'order', title: '订单通知' },
  { name: 'system', title: '系统公告' },
  { name: 'activity', title: '活动消息' }
]

// 页面挂载时加载数�?
onMounted(async () => {
  await fetchNotifications()
})

// 刷新数据
const fetchNotifications = async () => {
  loading.value = true
  try {
    await notificationStore.fetchNotifications()
    toast.success('加载成功')
  } catch (error) {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  try {
    await notificationStore.fetchNotifications()
    toast.success('刷新成功')
  } catch (error) {
    toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

// 根据类型筛选通知
const filteredNotifications = ref<Notification[]>([])

// 监听通知数据和筛选条件变�?
const updateFilteredNotifications = () => {
  if (activeTab.value === 'all') {
    filteredNotifications.value = [...notificationStore.notifications]
  } else {
    filteredNotifications.value = notificationStore.notifications.filter(notification => notification.type === activeTab.value)
  }
}

// 标记通知为已�?
const markAsRead = async (notificationId: string) => {
  await notificationStore.markAsRead(notificationId)
  toast.success('已标记为已读')
}

// 标记所有通知为已�?
const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
  toast.success('已全部标记为已读')
}

// 初始加载数据
updateFilteredNotifications()
</script>

<template>
  <div class="notification-center-container">
    <!-- 顶部导航栏-->
    <van-nav-bar title="消息中心" class="custom-nav-bar" left-arrow @click-left="() => $router.back()">
      <template #right>
        <div @click="markAllAsRead" class="mark-all-btn">
          <span class="mark-all-text">全部已读</span>
        </div>
      </template>
    </van-nav-bar>

    <!-- 筛选标签页 -->
    <div class="filter-tabs">
      <van-tabs v-model:active="activeTab" @change="updateFilteredNotifications">
        <van-tab 
          v-for="tab in tabs" 
          :key="tab.name" 
          :title="tab.title" 
          :name="tab.name"
        />
      </van-tabs>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list">
      <van-skeleton :loading="loading" title :rows="5" animated>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-empty 
            v-if="filteredNotifications.length === 0" 
            description="暂无通知" 
            image-size="100"
          >
            <template #bottom>
              <van-button type="primary" size="small" @click="fetchNotifications">
                重新加载
              </van-button>
            </template>
          </van-empty>
          <div v-else class="notification-cards">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              class="notification-card"
              :class="{ 'unread': !notification.isRead }"
              @click="markAsRead(notification.id)"
            >
              <div class="notification-header">
                <div class="notification-type" :class="`type-${notification.type}`">
                  <van-icon 
                    :name="notification.type === 'order' ? 'order-o' : notification.type === 'system' ? 'info-o' : 'gift-o'" 
                    size="16" 
                  />
                  <span class="type-text">
                    {{ notification.type === 'order' ? '订单通知' : notification.type === 'system' ? '系统公告' : '活动消息' }}
                  </span>
                </div>
                <div class="notification-time">{{ new Date(notification.createTime).toLocaleString() }}</div>
              </div>
              
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </van-skeleton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification-center-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 5rem;
  box-sizing: border-box;
}

/* 顶部导航�?*/
.custom-nav-bar {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  color: #fff;
}

.custom-nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

.mark-all-btn {
  padding: 0 1rem;
  cursor: pointer;
}

.mark-all-text {
  font-size: 1.4rem;
  color: #fff;
}

/* 筛选标签页 */
.filter-tabs {
  background-color: #fff;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-tabs :deep(.van-tab) {
  font-size: 1.4rem;
  font-weight: 500;
}

.filter-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
  height: 3px;
  width: 30px;
}

/* 通知列表 */
.notification-list {
  padding: 0 1rem 1rem;
}

.notification-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 通知卡片 */
.notification-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.notification-card.unread {
  border-left: 4px solid #1989fa;
}

/* 通知头部 */
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.notification-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
}

.type-order {
  background-color: #e6f7ff;
  color: #1989fa;
}

.type-system {
  background-color: #fff7e6;
  color: #faad14;
}

.type-activity {
  background-color: #f6ffed;
  color: #07c160;
}

.type-text {
  font-size: 1.2rem;
}

.notification-time {
  font-size: 1.2rem;
  color: #969799;
}

/* 通知内容 */
.notification-content {
  margin-bottom: 0.5rem;
}

.notification-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin-bottom: 0.5rem;
}

.notification-message {
  font-size: 1.3rem;
  color: #646566;
  line-height: 1.5;
}
</style>
