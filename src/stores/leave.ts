import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface LeaveRequest {
  id: string
  type: 'sick' | 'personal' | 'other' // 请假类型：病假、事假、其他
  startDate: string // 开始时间
  endDate: string // 结束时间
  reason: string // 请假原因
  status: 'pending' | 'approved' | 'rejected' // 状态：待审批、已批准、已拒绝
  createTime: string // 创建时间
  approveTime?: string // 审批时间
  approverName?: string // 审批人
  remark?: string // 审批备注
}

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaveRequests: [] as LeaveRequest[],
    currentLeave: null as LeaveRequest | null,
    loading: false
  }),

  actions: {
    async fetchLeaveRequests() {
      this.loading = true
      try {
        const data = await apiService.get('/api/leave/requests')
        
        if (data.code === 200) {
          this.leaveRequests = data.data
        }
      } catch (error) {
        console.error('Failed to fetch leave requests:', error)
      } finally {
        this.loading = false
      }
    },

    async submitLeaveRequest(leaveData: {
      type: LeaveRequest['type']
      startDate: string
      endDate: string
      reason: string
    }) {
      this.loading = true
      try {
        const data = await apiService.post('/api/leave/request', leaveData)
        
        if (data.code === 200) {
          this.leaveRequests.unshift(data.data)
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to submit leave request:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async cancelLeaveRequest(requestId: string) {
      this.loading = true
      try {
        const data = await apiService.post(`/api/leave/${requestId}/cancel`, {})
        
        if (data.code === 200) {
          const index = this.leaveRequests.findIndex(req => req.id === requestId)
          if (index !== -1) {
            this.leaveRequests.splice(index, 1)
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to cancel leave request:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async getLeaveRequestById(requestId: string) {
      this.loading = true
      try {
        const data = await apiService.get(`/api/leave/${requestId}`)
        
        if (data.code === 200) {
          this.currentLeave = data.data
          return data.data
        }
        return null
      } catch (error) {
        console.error('Failed to get leave request:', error)
        return null
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    pendingRequests: (state) => {
      return state.leaveRequests.filter(req => req.status === 'pending')
    },
    approvedRequests: (state) => {
      return state.leaveRequests.filter(req => req.status === 'approved')
    },
    rejectedRequests: (state) => {
      return state.leaveRequests.filter(req => req.status === 'rejected')
    },
    currentMonthRequests: (state) => {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      return state.leaveRequests.filter(req => {
        const reqDate = new Date(req.createTime)
        return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear
      })
    }
  },


})
