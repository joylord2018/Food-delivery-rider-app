import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

// 配送趋势数据类型
interface TrendItem {
  label: string
  value: number
}

// 收入分布数据类型
interface IncomeItem {
  label: string
  value: number
  percentage: number
}

// 统计数据类型
interface Statistics {
  totalEarnings: number // 总收入
  completedOrders: number // 完成订单数
  workDuration: number // 工作时长（分钟）
  averageDeliveryTime: number // 平均配送时间（分钟）
  onTimeRate: number // 准时率（%）
  goodCommentRate: number // 好评率（%）
  averageOrderEarnings: number // 单均收入
  deliveryTrend: TrendItem[] // 配送趋势
  incomeDistribution: IncomeItem[] // 收入分布
}

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    statistics: {
      totalEarnings: 0,
      completedOrders: 0,
      workDuration: 0,
      averageDeliveryTime: 0,
      onTimeRate: 0,
      goodCommentRate: 0,
      averageOrderEarnings: 0,
      deliveryTrend: [],
      incomeDistribution: []
    } as Statistics
  }),

  actions: {
    async fetchStatistics(timeRange: 'day' | 'week' | 'month') {
      try {
        const data = await apiService.get(`/api/statistics?range=${timeRange}`)
        
        if (data.code === 200) {
          this.statistics = data.data
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        throw error
      }
    }
  },

  
})