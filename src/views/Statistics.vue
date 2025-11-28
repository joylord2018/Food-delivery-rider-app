<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStatisticsStore } from '../stores/statistics'
import { toast } from '../utils/toast'

const router = useRouter()
const statisticsStore = useStatisticsStore()

// 加载状态
const loading = ref(false)

// 时间筛选
const activeTab = ref<'day' | 'week' | 'month'>('week')
const tabs = [
  { name: 'day' as const, title: '今日' },
  { name: 'week' as const, title: '本周' },
  { name: 'month' as const, title: '本月' }
]

// 页面挂载时加载数据
onMounted(async () => {
  await fetchStatistics()
})

// 刷新数据
const fetchStatistics = async () => {
  loading.value = true
  try {
    await statisticsStore.fetchStatistics(activeTab.value)
    toast.success('加载成功')
  } catch (error) {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 切换时间筛选
const handleTabChange = async (tabName: string) => {
  activeTab.value = tabName as 'day' | 'week' | 'month'
  await fetchStatistics()
}

// 计算统计数据
const statistics = computed(() => statisticsStore.statistics)

// 计算配送趋势的最大�?
const maxTrendValue = computed(() => {
  const values = statistics.value.deliveryTrend.map(item => item.value)
  return Math.max(1, ...values)
})

// 格式化时�?
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}
</script>

<template>
  <div class="statistics-container">
    <!-- 顶部导航�?-->
    <van-nav-bar title="工作统计" @click-left="router.back()" class="custom-nav-bar" left-arrow>
      <template #right>
        <div @click="fetchStatistics" class="refresh-btn">
          <van-icon name="replay" size="20" :loading="loading" color="#fff" />
        </div>
      </template>
    </van-nav-bar>

    <!-- 时间筛选标�?-->
    <div class="time-tabs">
      <van-tabs v-model:active="activeTab" @change="handleTabChange">
        <van-tab 
          v-for="tab in tabs" 
          :key="tab.name" 
          :title="tab.title" 
          :name="tab.name"
        />
      </van-tabs>
    </div>

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 统计概览 -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon earnings">
            <van-icon name="coin" size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-label">总收入</div>
            <div class="stat-value">¥{{ statistics.totalEarnings.toFixed(1) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orders">
            <van-icon name="orders-o" size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-label">完成订单</div>
            <div class="stat-value">{{ statistics.completedOrders }}单</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon duration">
            <van-icon name="clock-o" size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-label">工作时长</div>
            <div class="stat-value">{{ formatTime(statistics.workDuration) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon average">
            <van-icon name="time-o" size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-label">平均配送时间</div>
            <div class="stat-value">{{ statistics.averageDeliveryTime }}分钟</div>
          </div>
        </div>
      </div>

      <!-- 详细统计 -->
      <div class="detailed-stats">
        <!-- 配送趋势-->
        <div class="stat-section">
          <div class="section-header">
            <span class="section-title">配送趋势</span>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-title">订单完成数</div>
              <div class="chart-bars">
                <div 
                  v-for="(item, index) in statistics.deliveryTrend" 
                  :key="index"
                  class="chart-bar"
                >
                  <div 
                    class="bar" 
                    :style="{ height: `${(item.value / maxTrendValue * 100)}%` }"
                  ></div>
                  <div class="bar-label">{{ item.label }}</div>
                  <div class="bar-value">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 收入分布 -->
        <div class="stat-section">
          <div class="section-header">
            <span class="section-title">收入分布</span>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-title">收入来源</div>
              <div class="income-distribution">
                <div class="income-item" v-for="(item, index) in statistics.incomeDistribution" :key="index">
                  <div class="income-label">{{ item.label }}</div>
                  <div class="income-bar-container">
                    <div 
                      class="income-bar" 
                      :style="{ width: `${item.percentage}%` }"
                    ></div>
                    <span class="income-percentage">{{ item.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 工作效率 -->
        <div class="stat-section">
          <div class="section-header">
            <span class="section-title">工作效率</span>
          </div>
          <div class="efficiency-stats">
            <div class="efficiency-item">
              <div class="efficiency-label">准时率</div>
              <div class="efficiency-value">{{ statistics.onTimeRate }}%</div>
              <div class="efficiency-bar">
                <div 
                  class="efficiency-progress" 
                  :style="{ width: `${statistics.onTimeRate}%` }"
                ></div>
              </div>
            </div>
            <div class="efficiency-item">
              <div class="efficiency-label">好评率</div>
              <div class="efficiency-value">{{ statistics.goodCommentRate }}%</div>
              <div class="efficiency-bar">
                <div 
                  class="efficiency-progress" 
                  :style="{ width: `${statistics.goodCommentRate}%` }"
                ></div>
              </div>
            </div>
            <div class="efficiency-item">
              <div class="efficiency-label">单均收入</div>
              <div class="efficiency-value">¥{{ statistics.averageOrderEarnings.toFixed(1) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.statistics-container {
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部导航�?*/
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

.refresh-btn {
  padding: 0 1rem;
  cursor: pointer;
}

/* 时间筛选标�?*/
.time-tabs {
  background-color: #fff;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0 1rem 1rem;
}

.stat-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-icon.earnings {
  background: linear-gradient(135deg, #f5222d 0%, #ff7875 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
}

.stat-icon.duration {
  background: linear-gradient(135deg, #faad14 0%, #ffd666 100%);
}

.stat-icon.average {
  background: linear-gradient(135deg, #07c160 0%, #95de64 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 1.3rem;
  color: #969799;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #323233;
}

/* 详细统计 */
.detailed-stats {
  padding: 0 1rem 2rem;
}

.stat-section {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #323233;
}

/* 图表容器 */
.chart-container {
  height: 200px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.4rem;
  color: #646566;
  margin-bottom: 1rem;
  text-align: center;
}

/* 柱状�?*/
.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: calc(100% - 3rem);
  gap: 1rem;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.chart-bar .bar {
  width: 100%;
  background: linear-gradient(180deg, #1989fa 0%, #36cfc9 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.chart-bar .bar-label {
  font-size: 1.2rem;
  color: #969799;
}

.chart-bar .bar-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: #323233;
}

/* 收入分布 */
.income-distribution {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100% - 3rem);
  justify-content: center;
}

.income-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.income-label {
  font-size: 1.3rem;
  color: #646566;
  display: flex;
  justify-content: space-between;
}

.income-bar-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.income-bar {
  flex: 1;
  height: 8px;
  background: linear-gradient(90deg, #1989fa 0%, #36cfc9 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.income-percentage {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1989fa;
  min-width: 40px;
  text-align: right;
}

/* 工作效率 */
.efficiency-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.efficiency-item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.efficiency-label {
  font-size: 1.4rem;
  color: #646566;
  display: flex;
  justify-content: space-between;
}

.efficiency-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: #323233;
}

.efficiency-bar {
  height: 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.efficiency-progress {
  height: 100%;
  background: linear-gradient(90deg, #07c160 0%, #95de64 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
