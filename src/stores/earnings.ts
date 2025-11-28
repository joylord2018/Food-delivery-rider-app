import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'


export interface EarningRecord {
  id: string
  date: string
  amount: number
  taskId: string
  type: 'delivery' | 'bonus' | 'penalty'
  description: string
}

export const useEarningsStore = defineStore('earnings', {
  state: () => ({
    totalEarnings: 0,
    todayEarnings: 0,
    thisWeekEarnings: 0,
    thisMonthEarnings: 0,
    records: [] as EarningRecord[]
  }),

  actions: {
    async fetchEarnings() {
      try {
        // 获取收益统计
        const statsData = await apiService.get('/api/earnings/stats')
        
        if (statsData.code === 200) {
          this.totalEarnings = statsData.data.totalEarnings
          this.todayEarnings = statsData.data.todayEarnings
          this.thisWeekEarnings = statsData.data.thisWeekEarnings
          this.thisMonthEarnings = statsData.data.thisMonthEarnings
        }
        
        // 获取收益记录
        const recordsData = await apiService.get('/api/earnings/records')
        
        if (recordsData.code === 200) {
          this.records = recordsData.data
        }
      } catch (error) {
        console.error('Failed to fetch earnings:', error)
      }
    }
  },

  
})
