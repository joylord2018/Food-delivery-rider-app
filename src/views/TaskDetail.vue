<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../stores/task'
import CustomDialog from '../components/CustomDialog.vue'
import MapComponent from '../components/MapComponent.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import { toast } from '../utils/toast'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

// 获取任务ID
const taskId = computed(() => route.params.id as string)

// 加载状态
const loading = ref(false)

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

// 处理弹窗取消
const handleDialogCancel = () => {
  dialogVisible.value = false
}

// 获取任务详情
const task = computed(() => taskStore.getTaskById(taskId.value))

// 任务不存在时返回首页
if (!task.value) {
  toast.error('任务不存在')
  router.push('/home')
}

// 拨打电话
const makeCall = (phone: string) => {
  showDialog({
    title: '拨打电话',
    message: `确定要拨打${phone} 吗？`,
    type: 'confirm',
    onConfirm: () => {
      toast.info('正在拨打...')
      // 模拟拨打电话
    }
  })
}

// 导航到地址
const navigateToAddress = (address: string) => {
  toast.info(`正在导航�?${address}...`)
  // 模拟导航
}

// 确认取餐
const confirmPick = async () => {
  if (!task.value) return
  
  showDialog({
    title: '确认取餐',
    message: '确定已经取餐了吗？',
    type: 'confirm',
    onConfirm: async () => {
      loading.value = true
      try {
        await taskStore.pickTask(task.value!.id)
        toast.success('取餐成功')
        // 重新获取任务详情，更新状�?
        await taskStore.fetchTasks()
      } catch (error) {
        toast.error('取餐失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 确认送达
const confirmDeliver = async () => {
  if (!task.value) return
  
  showDialog({
    title: '确认送达',
    message: '确定已经送达了吗？',
    type: 'confirm',
    onConfirm: async () => {
      loading.value = true
      try {
        await taskStore.completeTask(task.value!.id)
        toast.success('送达成功')
        // 返回首页
        router.push('/home')
      } catch (error) {
        toast.error('送达失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 取消订单
const cancelOrder = async () => {
  if (!task.value) return
  
  showDialog({
    title: '取消订单',
    message: '确定要取消这个订单吗？取消订单可能会影响您的信用评分。',
    type: 'warning',
    onConfirm: async () => {
      loading.value = true
      try {
        await taskStore.cancelTask(task.value!.id)
        toast.success('订单已取消')
        // 返回首页
        router.push('/home')
      } catch (error) {
        toast.error('取消订单失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 任务状态文�?
const statusText = computed(() => {
  if (!task.value) return ''
  switch (task.value.status) {
    case 'pending': return '待接单'
    case 'accepted': return '已接单'
    case 'picked': return '已取餐'
    case 'delivered': return '已送达'
    case 'canceled': return '已取消'
    default: return ''
  }
})

// 任务状态颜色
const statusColor = computed(() => {
  if (!task.value) return '#969799'
  switch (task.value.status) {
    case 'pending': return '#969799'
    case 'accepted': return '#1989fa'
    case 'picked': return '#faad14'
    case 'delivered': return '#07c160'
    case 'canceled': return '#ee0a24'
    default: return '#969799'
  }
})

// 地图配置
const mapCenter = computed(() => {
  // 以餐厅地址为中�?
  return { lat: 39.908823, lng: 116.397470 }
})

// 地图标记点
const mapMarkers = computed(() => {
  if (!task.value) return []
  
  const markers = [
    {
      id: 'restaurant',
      type: 'restaurant' as const,
      label: task.value.restaurantName,
      lat: 39.908823,
      lng: 116.397470
    },
    {
      id: 'delivery',
      type: 'delivery' as const,
      label: task.value.customerName,
      lat: 39.910823,
      lng: 116.407470
    }
  ]
  
  return markers
})

// 导航路线
const mapRoute = computed(() => {
  return [
    { lat: 39.908823, lng: 116.397470 }, // 餐厅
    { lat: 39.909823, lng: 116.399470 }, // 途经点
    { lat: 39.910323, lng: 116.402470 }, // 途经点
    { lat: 39.910823, lng: 116.407470 }  // 配送地址
  ]
})

// 是否显示导航路线
const showRoute = ref(true)
</script>

<template>
  <div class="task-detail-container" v-if="task">
    <!-- 顶部导航栏-->
    <van-nav-bar title="任务详情" @click-left="router.back()" class="custom-nav-bar" left-arrow />

    <!-- 任务基本信息 -->
    <div class="task-info-card">
      <div class="task-header">
        <div class="task-status" :style="{ color: statusColor }">
          <van-icon 
            :name="task.status === 'pending' ? 'clock-o' : task.status === 'accepted' ? 'location-o' : task.status === 'picked' ? 'car' : 'success'" 
            size="16" 
            class="status-icon"
          />
          {{ statusText }}
        </div>
        <div class="task-order-id">
          订单号：{{ task.orderId }}
        </div>
      </div>
      
      <div class="task-stats">
        <div class="stat-item">
          <div class="stat-icon fee">
            <van-icon name="coin" size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-label">配送费</div>
            <div class="stat-value">¥{{ task.fee.toFixed(1) }}</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon distance">
            <van-icon name="distance" size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-label">距离</div>
            <div class="stat-value">{{ task.distance }}km</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon time">
            <van-icon name="clock-o" size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-label">预计时间</div>
            <div class="stat-value">{{ task.estimatedTime }}分钟</div>
          </div>
        </div>
      </div>
      
      <!-- 订单备注 -->
      <div v-if="task.notes && task.notes.length > 0" class="task-notes">
        <div class="notes-header">
          <van-icon name="warning-o" size="16" color="#faad14" />
          <span class="notes-title">特殊要求</span>
        </div>
        <div class="notes-list">
          <div 
            v-for="(note, index) in task.notes" 
            :key="index"
            class="note-item"
          >
            <van-icon name="info-o" size="14" color="#faad14" />
            <span class="note-text">{{ note }}</span>
          </div>
        </div>
      </div>
      
      <!-- 倒计时组�?-->
      <div class="countdown-section">
        <CountdownTimer 
          v-if="task.status === 'accepted'" 
          label="取餐倒计时" 
          :target-time="new Date(Date.now() + 30 * 60 * 1000).toISOString()" 
          :warning-threshold="5 * 60" 
          :danger-threshold="1 * 60" 
        />
        <CountdownTimer 
          v-else-if="task.status === 'picked'" 
          label="送达倒计时" 
          :target-time="new Date(Date.now() + 30 * 60 * 1000).toISOString()" 
          :warning-threshold="5 * 60" 
          :danger-threshold="1 * 60" 
        />
      </div>
    </div>

    <!-- 地图导航 -->
    <div class="map-section">
      <div class="map-title">
        <van-icon name="location-o" size="16" color="#1989fa" />
        <span class="map-title-text">实时导航</span>
      </div>
      <div class="map-container">
        <MapComponent 
          :center="mapCenter" 
          :markers="mapMarkers" 
          :show-route="showRoute" 
          :route="mapRoute" 
        />
      </div>
    </div>

    <!-- 餐厅信息 -->
    <div class="address-card">
      <div class="card-header">
        <van-icon name="shop-o" color="#1989fa" />
        <span class="card-title">餐厅信息</span>
      </div>
      
      <div class="address-info">
        <div class="address-name">{{ task.restaurantName }}</div>
        <div class="address-detail">{{ task.restaurantAddress }}</div>
      </div>
      
      <div class="address-actions">
        <van-button 
          type="primary" 
          size="small" 
          icon="phone-o"
          @click="makeCall(task.customerPhone)"
          class="action-btn"
        >
          联系餐厅
        </van-button>
        <van-button 
          type="default" 
          size="small" 
          icon="location-o"
          @click="navigateToAddress(task.restaurantAddress)"
          class="action-btn"
        >
          导航
        </van-button>
      </div>
    </div>

    <!-- 配送地址 -->
    <div class="address-card">
      <div class="card-header">
        <van-icon name="location-o" color="#07c160" />
        <span class="card-title">配送地址</span>
      </div>
      
      <div class="address-info">
        <div class="address-name">{{ task.customerName }}</div>
        <div class="address-detail">{{ task.deliveryAddress }}</div>
      </div>
      
      <div class="address-actions">
        <van-button 
          type="primary" 
          size="small" 
          icon="phone-o"
          @click="makeCall(task.customerPhone)"
          class="action-btn"
        >
          联系客户
        </van-button>
        <van-button 
          type="default" 
          size="small" 
          icon="location-o"
          @click="navigateToAddress(task.deliveryAddress)"
          class="action-btn"
        >
          导航
        </van-button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <!-- 已接单状�?-->
      <div v-if="task.status === 'accepted' || task.status === 'picked'" class="action-buttons-group">
        <!-- 主要操作按钮 -->
        <van-button
          v-if="task.status === 'accepted'"
          type="warning"
          block
          size="large"
          :loading="loading"
          @click="confirmPick"
          class="main-action-btn"
        >
          <van-icon name="shop-o" size="16" />
          确认取餐
        </van-button>
        
        <!-- 已取餐状�?-->
        <van-button
          v-else-if="task.status === 'picked'"
          type="success"
          block
          size="large"
          :loading="loading"
          @click="confirmDeliver"
          class="main-action-btn"
        >
          <van-icon name="location-o" size="16" />
          确认送达
        </van-button>
        
        <!-- 取消订单按钮 -->
        <van-button
          type="danger"
          block
          size="large"
          :loading="loading"
          @click="cancelOrder"
          class="cancel-action-btn"
        >
          <van-icon name="close" size="16" />
          取消订单
        </van-button>
      </div>
      
      <!-- 已送达状�?-->
      <van-button
        v-else-if="task.status === 'delivered'"
        type="primary"
        block
        size="large"
        @click="router.push('/home')"
        class="main-action-btn"
      >
        <van-icon name="home-o" size="16" />
        返回首页
      </van-button>
    </div>
    
    <!-- 自定义弹窗组件-->
    <CustomDialog
      v-model:visible="dialogVisible"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirm-text="dialogConfig.confirmText"
      :cancel-text="dialogConfig.cancelText"
      :type="dialogConfig.type"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.task-detail-container {
  min-height: 100vh;
  background-color: $background-color;

  /* 顶部导航栏*/
  .custom-nav-bar {
    background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
    color: $white;

    :deep(.van-nav-bar__title) {
      color: $white;
      font-weight: 600;
    }

    :deep(.van-icon) {
      color: $white;
    }
  }

  /* 任务信息卡片 */
  .task-info-card {
    background-color: $white;
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .task-status {
        font-size: 1.6rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .status-icon {
          animation: pulse 2s infinite;
        }
      }

      .task-order-id {
        font-size: 1.2rem;
        color: $text-color-secondary;
      }
    }

    /* 任务统计 */
    .task-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid $border-color;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        padding: 1.5rem 1rem;
        background-color: #fafafa;
        border-radius: 12px;
        transition: all 0.3s ease;
        text-align: center;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: $white;

          &.fee {
            background: linear-gradient(135deg, $danger-color 0%, #ff7875 100%);
          }

          &.distance {
            background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
          }

          &.time {
            background: linear-gradient(135deg, $warning-color 0%, #ffd666 100%);
          }
        }

        .stat-content {
          width: 100%;

          .stat-label {
            font-size: 1.2rem;
            color: $text-color-secondary;
            margin-bottom: 0.3rem;
          }

          .stat-value {
            font-size: 1.8rem;
            font-weight: 600;
            color: $text-color;
          }
        }
      }
    }

    /* 倒计时区域 */
    .countdown-section {
      padding: 1.5rem 0 0 0;
      border-top: 1px solid $border-color;
    }
  }

  /* 地图导航 */
  .map-section {
    background-color: $white;
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .map-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.2rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: $text-color;

      .map-title-text {
        font-size: 1.5rem;
        font-weight: 600;
        color: $text-color;
      }
    }

    .map-container {
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  /* 地址卡片 */
  .address-card {
    background-color: $white;
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.2rem;

      .card-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: $text-color;
      }
    }

    .address-info {
      margin-bottom: 1.5rem;

      .address-name {
        font-size: 1.4rem;
        font-weight: 500;
        color: $text-color;
        margin-bottom: 0.5rem;
      }

      .address-detail {
        font-size: 1.3rem;
        color: #646566;
        line-height: 1.5;
        padding: 1rem;
        background-color: #fafafa;
        border-radius: 8px;
      }
    }

    .address-actions {
      display: flex;
      gap: 1rem;
      padding-top: 1.2rem;
      border-top: 1px solid $border-color;

      .action-btn {
        flex: 1;
        border-radius: 20px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }

  /* 操作按钮 */
  .action-buttons {
    padding: 1rem;
    margin-top: 2rem;

    /* 操作按钮组 */
    .action-buttons-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .main-action-btn,
    .cancel-action-btn {
      height: 50px;
      font-size: 1.6rem;
      font-weight: 600;
      border-radius: 25px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
