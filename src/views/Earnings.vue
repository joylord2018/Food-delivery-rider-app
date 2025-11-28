<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEarningsStore } from '../stores/earnings'
import { toast } from '../utils/toast'

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
    <van-nav-bar title="收益" class="custom-nav-bar" />

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
.earnings-container {
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航栏*/
.custom-nav-bar {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  color: #fff;
  position: relative;
  z-index: 10;
}

/* 可滚动内容区域 */
.scrollable-content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.custom-nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

/* 收益统计卡片 */
.earnings-stats-card {
  background-color: #fff;
  padding: 1.5rem;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background-color: #fafafa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
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
  font-size: 20px;
  color: #fff;
}

.stat-icon.total {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
}

.stat-icon.week {
  background: linear-gradient(135deg, #faad14 0%, #ffd666 100%);
}

.stat-icon.month {
  background: linear-gradient(135deg, #f5222d 0%, #ff7875 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 1.2rem;
  color: #969799;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: #323233;
}

.stat-value.highlight {
  color: #52c41a;
  font-size: 2rem;
}

/* 提现按钮 */
.withdraw-section {
  margin-top: 1.5rem;
}

.withdraw-btn {
  border-radius: 25px;
  font-weight: 600;
  padding: 1rem 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border: none;
}

/* 时间筛�?*/
.time-filter-section {
  background-color: #fff;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.time-tabs {
  background-color: #fff;
}

.time-tabs :deep(.van-tabs__nav) {
  background-color: #fff;
}

.time-tabs :deep(.van-tab) {
  font-size: 1.4rem;
  font-weight: 500;
}

.time-tabs :deep(.van-tabs__line) {
  background-color: #1989fa;
  height: 3px;
  width: 30px;
}

/* 收益趋势�?*/
.trend-section {
  background-color: #fff;
  margin: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.trend-header {
  margin-bottom: 1.5rem;
}

.trend-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin: 0;
}

.trend-chart {
  background-color: #fafafa;
  padding: 1.5rem;
  border-radius: 8px;
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
  padding: 0 1rem;
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
  background: linear-gradient(180deg, #1989fa 0%, #36cfc9 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
}

.bar:hover {
  transform: scaleY(1.05);
  box-shadow: 0 4px 8px rgba(25, 137, 250, 0.3);
}

.bar-label {
  font-size: 1.1rem;
  color: #969799;
  margin-top: 0.5rem;
  text-align: center;
}

.bar-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1989fa;
  margin-bottom: 0.5rem;
  text-align: center;
}

/* 收益记录标题 */
.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #fff;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.records-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin: 0;
}

.refresh-icon {
  cursor: pointer;
  color: #969799;
  transition: all 0.3s ease;
}

.refresh-icon:hover {
  color: #1989fa;
  transform: rotate(180deg);
}

/* 收益记录列表 */
.records-list {
  padding: 0 1rem 1rem;
}

.record-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.record-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ebedf0;
  transition: all 0.3s ease;
  gap: 1.2rem;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background-color: #fafafa;
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* 左侧图标 */
.record-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.icon-delivery {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  color: #1989fa;
}

.icon-bonus {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  color: #52c41a;
}

.icon-penalty {
  background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
  color: #f5222d;
}

.record-item:hover .record-icon {
  transform: scale(1.1);
}

/* 中间内容 */
.record-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.record-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.record-title {
  font-size: 1.4rem;
  font-weight: 500;
  color: #323233;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.record-type {
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.type-delivery {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
}

.type-bonus {
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
}

.type-penalty {
  background: linear-gradient(135deg, #f5222d 0%, #ff7875 100%);
}

.record-date {
  font-size: 1.1rem;
  color: #969799;
  white-space: nowrap;
}

.record-amount {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
  min-width: 80px;
}

.amount-delivery {
  color: #1989fa;
}

.amount-bonus {
  color: #52c41a;
}

.amount-penalty {
  color: #f5222d;
}
</style>
