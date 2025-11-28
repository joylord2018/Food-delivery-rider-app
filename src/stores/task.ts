import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface Task {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  restaurantName: string
  restaurantAddress: string
  deliveryAddress: string
  distance: number
  fee: number
  status: 'pending' | 'accepted' | 'picked' | 'delivered' | 'canceled'
  createTime: string
  estimatedTime: number
  expectedDeliveryTime: string // 预计送达时间
  notes: string[] // 订单备注和特殊要求
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    currentTask: null as Task | null
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter(task => task.status === 'pending'),
    acceptedTasks: (state) => state.tasks.filter(task => task.status === 'accepted'),
    pickedTasks: (state) => state.tasks.filter(task => task.status === 'picked'),
    deliveredTasks: (state) => state.tasks.filter(task => task.status === 'delivered')
  },

  actions: {
    async fetchTasks() {
      try {
        const data = await apiService.get('/api/tasks', {}, { useCache: false })
        
        if (data.code === 200) {
          this.tasks = data.data
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      }
    },

    async acceptTask(taskId: string) {
      try {
        const data = await apiService.post(`/api/tasks/${taskId}/accept`, {})
        
        if (data.code === 200) {
          // 更新本地任务状态
          const taskIndex = this.tasks.findIndex(task => task.id === taskId)
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = data.data
            this.currentTask = data.data
          }
        }
      } catch (error) {
        console.error('Failed to accept task:', error)
        throw error
      }
    },

    async pickTask(taskId: string) {
      try {
        const data = await apiService.post(`/api/tasks/${taskId}/pick`, {})
        
        if (data.code === 200) {
          // 更新本地任务状态
          const taskIndex = this.tasks.findIndex(task => task.id === taskId)
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = data.data
          }
        }
      } catch (error) {
        console.error('Failed to pick task:', error)
        throw error
      }
    },

    async completeTask(taskId: string) {
      try {
        const data = await apiService.post(`/api/tasks/${taskId}/complete`, {})
        
        if (data.code === 200) {
          // 更新本地任务状态
          const taskIndex = this.tasks.findIndex(task => task.id === taskId)
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = data.data
            if (this.currentTask?.id === taskId) {
              this.currentTask = null
            }
          }
        }
      } catch (error) {
        console.error('Failed to complete task:', error)
        throw error
      }
    },

    async cancelTask(taskId: string) {
      try {
        const data = await apiService.post(`/api/tasks/${taskId}/cancel`, {})
        
        if (data.code === 200) {
          // 更新本地任务状态
          const taskIndex = this.tasks.findIndex(task => task.id === taskId)
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = data.data
            if (this.currentTask?.id === taskId) {
              this.currentTask = null
            }
          }
        }
      } catch (error) {
        console.error('Failed to cancel task:', error)
        throw error
      }
    },

    getTaskById(taskId: string) {
      return this.tasks.find(task => task.id === taskId) || null
    }
  },

  
})
