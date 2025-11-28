<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore, type Task } from '../stores/task'
import { toast } from '../utils/toast'

const router = useRouter()
const taskStore = useTaskStore()

// 加载状态
const loading = ref(false)
const refreshing = ref(false)

// 筛选条件
const activeTab = ref('all')
const tabs = [
  { name: 'all', title: '全部' },
  { name: 'pending', title: '待接单' },
  { name: 'accepted', title: '已接单' },
  { name: 'picked', title: '已取餐' },
  { name: 'delivered', title: '已完成' },
  { name: 'canceled', title: '已取消' }
]

// 页面挂载时加载数据
onMounted(async () => {
  await fetchOrders()
  updateFilteredOrders()
})

// 刷新数据
const fetchOrders = async () => {
  loading.value = true
  try {
    await taskStore.fetchTasks()
    updateFilteredOrders()
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
    await taskStore.fetchTasks()
    updateFilteredOrders()
    toast.success('刷新成功')
  } catch (error) {
    toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

// 根据状态筛选订单
const filteredOrders = ref<Task[]>([])

// 监听订单数据和筛选条件变化
const updateFilteredOrders = () => {
  // 确保taskStore.tasks是数组
  const tasks = taskStore.tasks || []
  if (activeTab.value === 'all') {
    filteredOrders.value = [...tasks]
  } else {
    filteredOrders.value = tasks.filter(task => task.status === activeTab.value)
  }
}

// 初始加载数据 - 移到onMounted后调用，确保store已初始化

// 查看订单详情
const viewOrderDetail = (orderId: string) => {
  router.push(`/task/${orderId}`)
}
</script>

<template>
  <div class="order-history-container">
    <!-- 顶部导航栏-->
    <van-nav-bar 
      title="订单历史" 
      class="custom-nav-bar"
      left-arrow
      @click-left="() => $router.back()"
    />

    <!-- 筛选标签页 -->
    <div class="filter-tabs">
      <van-tabs v-model:active="activeTab" @change="updateFilteredOrders">
        <van-tab 
          v-for="tab in tabs" 
          :key="tab.name" 
          :title="tab.title" 
          :name="tab.name"
        />
      </van-tabs>
    </div>

    <!-- 可滚动订单列表 -->
    <div class="scrollable-order-list">
      <!-- 订单列表 -->
      <div class="order-list">
        <van-skeleton :loading="loading" title :rows="5" animated>
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-empty 
              v-if="filteredOrders.length === 0" 
              description="暂无订单记录"
              image-size="100"
            >
              <template #bottom>
                <van-button type="primary" size="small" @click="fetchOrders">
                  重新加载
                </van-button>
              </template>
            </van-empty>
            <div v-else class="order-cards">
              <div 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="order-card"
                @click="viewOrderDetail(order.id)"
              >
                <div class="order-header">
                  <div class="order-id">订单号：{{ order.orderId }}</div>
                  <div 
                    class="order-status" 
                    :class="`status-${order.status}`"
                  >
                    {{ 
                      order.status === 'pending' ? '待接单' : 
                      order.status === 'accepted' ? '已接单' : 
                      order.status === 'picked' ? '已取餐' : 
                      order.status === 'delivered' ? '已完成' : '已取消' 
                    }}
                  </div>
                </div>
                
                <div class="order-content">
                  <div class="order-info">
                    <div class="restaurant-info">
                      <van-icon name="shop-o" size="14" color="#1989fa" />
                      <span class="restaurant-name">{{ order.restaurantName }}</span>
                    </div>
                    <div class="delivery-info">
                      <van-icon name="location-o" size="14" color="#07c160" />
                      <span class="delivery-address">{{ order.deliveryAddress }}</span>
                    </div>
                  </div>
                  
                  <div class="order-stats">
                    <div class="stat-item">
                      <span class="stat-label">配送费</span>
                      <span class="stat-value">¥{{ order.fee.toFixed(1) }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">距离</span>
                      <span class="stat-value">{{ order.distance }}km</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">时间</span>
                      <span class="stat-value">{{ order.estimatedTime }}分钟</span>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <div class="order-time">
                    {{ new Date(order.createTime).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </van-pull-refresh>
        </van-skeleton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.order-history-container {
  height: 100%;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 顶部导航栏*/
  .custom-nav-bar {
    background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
    color: $white;
    position: relative;
    z-index: 10;

    :deep(.van-nav-bar__title) {
      color: $white;
      font-weight: 600;
    }
  }

  /* 筛选标签页 */
  .filter-tabs {
    background-color: $white;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 5;

    :deep(.van-tab) {
      font-size: 1.4rem;
      font-weight: 500;
    }

    :deep(.van-tabs__line) {
      background-color: $primary-color;
      height: 3px;
      width: 30px;
    }
  }

  /* 可滚动订单列表 */
  .scrollable-order-list {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* 订单列表 */
  .order-list {
    padding: 0 1rem 1rem;

    .order-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      /* 订单卡片 */
      .order-card {
        background-color: $white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        /* 订单头部 */
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid $border-color;

          .order-id {
            font-size: 1.3rem;
            color: #646566;
          }

          .order-status {
            font-size: 1.3rem;
            font-weight: 500;
            padding: 0.4rem 1rem;
            border-radius: 12px;

            &.status-pending {
              background-color: $background-color;
              color: $text-color-secondary;
            }

            &.status-accepted {
              background-color: #e6f7ff;
              color: $primary-color;
            }

            &.status-picked {
              background-color: #fff7e6;
              color: $warning-color;
            }

            &.status-delivered {
              background-color: #f6ffed;
              color: $success-color;
            }

            &.status-canceled {
              background-color: #fff1f0;
              color: $danger-color;
            }
          }
        }

        /* 订单内容 */
        .order-content {
          margin-bottom: 1.2rem;

          .order-info {
            margin-bottom: 1.2rem;

            .restaurant-info,
            .delivery-info {
              display: flex;
              align-items: center;
              gap: 0.8rem;
              margin-bottom: 0.8rem;
              font-size: 1.3rem;
              color: $text-color;

              .restaurant-name,
              .delivery-address {
                flex: 1;
                line-height: 1.5;
              }
            }
          }

          /* 订单统计 */
          .order-stats {
            display: flex;
            justify-content: space-around;
            padding: 1rem;
            background-color: #fafafa;
            border-radius: 8px;

            .stat-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.3rem;

              .stat-label {
                font-size: 1.2rem;
                color: $text-color-secondary;
              }

              .stat-value {
                font-size: 1.5rem;
                font-weight: 600;
                color: $text-color;
              }
            }
          }
        }

        /* 订单底部 */
        .order-footer {
          padding-top: 1.2rem;
          border-top: 1px solid $border-color;

          .order-time {
            font-size: 1.2rem;
            color: $text-color-secondary;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
