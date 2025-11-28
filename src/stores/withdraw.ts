import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface WithdrawRecord {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createTime: string
  completeTime?: string
  bankAccount: string
  bankName: string
}

export const useWithdrawStore = defineStore('withdraw', {
  state: () => ({
    withdrawRecords: [] as WithdrawRecord[],
    availableBalance: 0,
    minimumWithdrawAmount: 50,
    processingTime: '1-3个工作日'
  }),

  actions: {
    async fetchWithdrawRecords() {
      try {
        const data = await apiService.get('/api/withdraw/records')
        
        if (data.code === 200) {
          this.withdrawRecords = data.data
        }
      } catch (error) {
        console.error('Failed to fetch withdraw records:', error)
      }
    },

    async fetchAvailableBalance() {
      try {
        const data = await apiService.get('/api/withdraw/available')
        
        if (data.code === 200) {
          this.availableBalance = data.data.availableBalance
          this.minimumWithdrawAmount = data.data.minimumWithdrawAmount
          this.processingTime = data.data.processingTime
        }
      } catch (error) {
        console.error('Failed to fetch available balance:', error)
      }
    },

    async submitWithdrawRequest(amount: number, bankAccount: string, bankName: string) {
      try {
        const data = await apiService.post('/api/withdraw/request', {
          amount,
          bankAccount,
          bankName
        })
        
        if (data.code === 200) {
          // 更新本地状态
          await this.fetchAvailableBalance()
          await this.fetchWithdrawRecords()
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to submit withdraw request:', error)
        return false
      }
    },

    async cancelWithdrawRequest(recordId: string) {
      try {
        const data = await apiService.post(`/api/withdraw/${recordId}/cancel`, {})
        
        if (data.code === 200) {
          // 更新本地状态
          await this.fetchWithdrawRecords()
          await this.fetchAvailableBalance()
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to cancel withdraw request:', error)
        return false
      }
    }
  },

  getters: {
    pendingWithdrawals: (state) => {
      return state.withdrawRecords.filter(record => record.status === 'pending' || record.status === 'processing')
    },
    completedWithdrawals: (state) => {
      return state.withdrawRecords.filter(record => record.status === 'completed')
    },
    failedWithdrawals: (state) => {
      return state.withdrawRecords.filter(record => record.status === 'failed')
    }
  },


})
