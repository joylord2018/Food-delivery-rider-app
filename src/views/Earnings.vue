<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEarningsStore } from '../stores/earnings'
import { toast } from '../utils/toast'
import CustomNavBar from '../components/CustomNavBar.vue'

const router = useRouter()
const earningsStore = useEarningsStore()

// 加载状态
const loading = ref(false)
const refreshing = ref(false)

// 时间筛选
const activeTimeFilter = ref('today')
const timeFilters = [
  { name: 'today', label: '今日' },
  { name: 'week', label: '本周' },
  { name: 'month', label: '本月' },
  { name: 'all', label: '全部' }
]

// 收益趋势数据
const trendData = ref([
  { date: '1日', amount: 120 },
  { date: '2日', amount: 150 },
  { date: '3日', amount: 90 },
  { date: '4日', amount: 200 },
  { date: '5日', amount: 180 },
  { date: '6日', amount: 220 },
  { date: '7日', amount: 160 }
])

// 刷新数据
const refreshEarnings = async () => {
  refreshing.value = true
  try {
    await earningsStore.fetchEarnings()
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
    await earningsStore.fetchEarnings()
  } catch (error) {
    toast.error('加载收益数据失败')
  } finally {
    loading.value = false
  }
})

// 获取收益类型文本
const getEarningTypeText = (type: 'delivery' | 'bonus' | 'penalty') => {
  switch (type) {
    case 'delivery': return '配送费'
    case 'bonus': return '奖励'
    case 'penalty': return '罚款'
    default: return '其他'
  }
}

// 跳转到提现页面
const goToWithdraw = () => {
  router.push('/withdraw')
}
</script>

<template>
  <div class="earnings-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="收益" show-back="false" />

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 收益统计卡片 -->
      <van-skeleton :loading="loading" title :rows="4" animated>
        <div class="earnings-stats-card">
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-icon total">
                <van-icon name="coin" size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">总收益</div>
                <div class="stat-value">¥{{ earningsStore.totalEarnings.toFixed(1) }}</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon today">
                <van-icon name="calendar-o" size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">今日收益</div>
                <div class="stat-value highlight">¥{{ earningsStore.todayEarnings.toFixed(1) }}</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon week">
                <van-icon name="clock-o" size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">本周收益</div>
                <div class="stat-value">¥{{ earningsStore.thisWeekEarnings.toFixed(1) }}</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon month">
                <van-icon name="date" size="24" />
              </div>
              <div class="stat-content">
                <div class="stat-label">本月收益</div>
                <div class="stat-value">¥{{ earningsStore.thisMonthEarnings.toFixed(1) }}</div>
              </div>
            </div>
          </div>
          
          <!-- 提现按钮 -->
          <div class="withdraw-section">
            <van-button 
              type="primary" 
              block 
              size="large" 
              @click="goToWithdraw"
              class="withdraw-btn"
            >
              立即提现
            </van-button>
          </div>
        </div>
      </van-skeleton>

      <!-- 时间筛选-->
      <div class="time-filter-section">
        <van-tabs v-model:active="activeTimeFilter" class="time-tabs">
          <van-tab 
            v-for="filter in timeFilters" 
            :key="filter.name" 
            :title="filter.label" 
            :name="filter.name"
          />
        </van-tabs>
      </div>

      <!-- 收益趋势图-->
      <div class="trend-section">
        <div class="trend-header">
          <h3 class="trend-title">收益趋势</h3>
        </div>
        <div class="trend-chart">
          <div class="chart-container">
            <!-- 简易柱状图 -->
            <div class="bar-chart">
              <div 
                v-for="(item, index) in trendData" 
                :key="index"
                class="chart-bar"
              >
                <div class="bar" :style="{ height: `${(item.amount / 250) * 100}%` }"></div>
                <div class="bar-label">{{ item.date }}</div>
                <div class="bar-value">¥{{ item.amount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收益记录标题 -->
      <div class="records-header">
        <h3 class="records-title">收益记录</h3>
        <van-icon 
          name="replay" 
          size="18" 
          :loading="refreshing" 
          @click="refreshEarnings"
          class="refresh-icon"
        />
      </div>

      <!-- 收益记录列表 -->
      <van-skeleton :loading="loading" title :rows="5" animated>
        <van-pull-refresh v-model="refreshing" @refresh="refreshEarnings">
          <div class="records-list">
            <van-empty 
              v-if="earningsStore.records.length === 0" 
              description="暂无收益记录"
              image-size="100"
            >
              <template #bottom>
                <van-button type="primary" size="small" @click="refreshEarnings">
                  刷新记录
                </van-button>
              </template>
            </van-empty>
            <div v-else class="record-list">
              <div 
                v-for="record in earningsStore.records" 
                :key="record.id"
                class="record-item"
              >
                <!-- 左侧图标 -->
                <div class="record-icon" :class="`icon-${record.type}`">
                  <van-icon 
                    :name="record.type === 'delivery' ? 'car' : record.type === 'bonus' ? 'gift-o' : 'warning-o'" 
                    size="24" 
                  />
                </div>
                
                <!-- 中间内容 -->
                <div class="record-content">
                  <div class="record-main">
                    <span class="record-title">{{ record.description }}</span>
                    <span class="record-amount" :class="`amount-${record.type}`">
                      {{ record.type === 'penalty' ? '-' : '+' }}¥{{ record.amount.toFixed(1) }}
                    </span>
                  </div>
                  <div class="record-meta">
                    <span 
                      class="record-type" 
                      :class="`type-${record.type}`"
                    >
                      {{ getEarningTypeText(record.type) }}
                    </span>
                    <span class="record-date">
                      {{ new Date(record.date).toLocaleString() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </van-skeleton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.earnings-container {
  height: 100%;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 可滚动内容区域 */
.scrollable-content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 收益统计卡片 */
.earnings-stats-card {
  background-color: $white;
  padding: $spacing-xl;
  margin: $spacing-lg;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
  }
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg;
  background-color: $background-color-light;
  border-radius: $border-radius-md;
  transition: all $transition-base;
  border: 1px solid $border-color-light;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: $primary-light;
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-lg;
  color: $white;
  flex-shrink: 0;
}

.stat-icon.total {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, $success-color 0%, rgba(7, 193, 96, 0.9) 100%);
}

.stat-icon.week {
  background: linear-gradient(135deg, $warning-color 0%, rgba(250, 173, 20, 0.9) 100%);
}

.stat-icon.month {
  background: linear-gradient(135deg, $danger-color 0%, rgba(255, 77, 79, 0.9) 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: $font-size-md;
  color: $text-color-secondary;
  margin-bottom: $spacing-xs;
  font-weight: $font-weight-medium;
}

.stat-value {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  color: $text-color;
  line-height: $line-height-sm;
}

.stat-value.highlight {
  color: $success-color;
  font-size: $font-size-xxxl;
}

/* 提现按钮 */
.withdraw-section {
  margin-top: $spacing-xl;
}

.withdraw-btn {
  border-radius: $border-radius-full;
  font-weight: $font-weight-semibold;
  padding: $spacing-lg 0;
  font-size: $font-size-lg;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(25, 137, 250, 0.3);
  transition: all $transition-base;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(25, 137, 250, 0.4);
    transform: translateY(-2px);
  }
}

/* 时间筛选 */
.time-filter-section {
  background-color: $white;
  margin: $spacing-lg;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
  }
}

.time-tabs {
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

/* 收益趋势图 */
.trend-section {
  background-color: $white;
  margin: $spacing-lg;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
  }
}

.trend-header {
  margin-bottom: $spacing-xl;
}

.trend-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-color;
  margin: 0;
}

.trend-chart {
  background-color: $background-color-light;
  padding: $spacing-xl;
  border-radius: $border-radius-md;
  border: 1px solid $border-color-light;
}

.chart-container {
  height: 200px;
  position: relative;
}

/* 简易柱状图 */
.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  padding: 0 $spacing-lg;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  flex: 1;
  max-width: 40px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, $primary-color 0%, $primary-light 100%);
  border-radius: $border-radius-sm $border-radius-sm 0 0;
  transition: all $transition-base;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
  
  &:hover {
    transform: scaleY(1.05);
    box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
  }
}

.bar-label {
  font-size: $font-size-xs;
  color: $text-color-secondary;
  margin-top: $spacing-xs;
  text-align: center;
  font-weight: $font-weight-medium;
}

.bar-value {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $primary-color;
  margin-bottom: $spacing-xs;
  text-align: center;
}

/* 收益记录标题 */
.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  background-color: $white;
  margin: $spacing-lg;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
  }
}

.records-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-color;
  margin: 0;
}

.refresh-icon {
  cursor: pointer;
  color: $text-color-secondary;
  transition: all $transition-base;
  font-size: $font-size-lg;
  
  &:hover {
    color: $primary-color;
    transform: rotate(180deg);
  }
}

/* 收益记录列表 */
.records-list {
  padding: 0 $spacing-lg $spacing-lg;
}

.record-list {
  background-color: $white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
  }
}

.record-item {
  display: flex;
  align-items: center;
  padding: $spacing-xl;
  border-bottom: 1px solid $border-color-light;
  transition: all $transition-base;
  gap: $spacing-lg;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: $background-color-light;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
}

/* 左侧图标 */
.record-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all $transition-base;
  font-size: $font-size-lg;
  
  .record-item:hover & {
    transform: scale(1.1);
  }
}

.icon-delivery {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  color: $primary-color;
}

.icon-bonus {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  color: $success-color;
}

.icon-penalty {
  background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
  color: $danger-color;
}

/* 中间内容 */
.record-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.record-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.record-title {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $text-color;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.record-type {
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.type-delivery {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
}

.type-bonus {
  background: linear-gradient(135deg, $success-color 0%, rgba(7, 193, 96, 0.9) 100%);
}

.type-penalty {
  background: linear-gradient(135deg, $danger-color 0%, rgba(255, 77, 79, 0.9) 100%);
}

.record-date {
  font-size: $font-size-xs;
  color: $text-color-secondary;
  white-space: nowrap;
}

.record-amount {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  text-align: right;
  flex-shrink: 0;
  min-width: 80px;
}

.amount-delivery {
  color: $primary-color;
}

.amount-bonus {
  color: $success-color;
}

.amount-penalty {
  color: $danger-color;
}

/* 响应式设计 */
@media (max-width: $breakpoint-sm) {
  .earnings-stats-card,
  .time-filter-section,
  .trend-section,
  .records-header {
    margin: $spacing-md;
    padding: $spacing-lg;
  }
  
  .stat-grid {
    gap: $spacing-lg;
  }
  
  .stat-item {
    padding: $spacing-md;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: $font-size-md;
  }
  
  .stat-value {
    font-size: $font-size-xl;
  }
  
  .stat-value.highlight {
    font-size: $font-size-xxl;
  }
  
  .record-item {
    padding: $spacing-lg;
  }
  
  .record-amount {
    font-size: $font-size-xl;
  }
  
  .record-icon {
    width: 48px;
    height: 48px;
    font-size: $font-size-md;
  }
}
</style>
