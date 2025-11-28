import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface User {
  id: string
  phone: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  rating: number // 骑手评分
  ratingCount: number // 评价数量
  onTimeRate: number // 准时率
  goodCommentRate: number // 好评率
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(phone: string, password: string) {
      try {
        const data = await apiService.post('/api/auth/login', { phone, password })
        
        if (data.code === 200) {
          this.token = data.data.token
          this.user = data.data.user
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('user', JSON.stringify(data.data.user))
        } else {
          throw new Error(data.message || '登录失败')
        }
      } catch (error: any) {
        throw new Error(error.message || '登录失败')
      }
    },

    async register(phone: string, password: string, name: string) {
      try {
        const data = await apiService.post('/api/auth/register', { phone, password, name })
        
        if (data.code === 200) {
          this.token = data.data.token
          this.user = data.data.user
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('user', JSON.stringify(data.data.user))
        } else {
          throw new Error(data.message || '注册失败')
        }
      } catch (error: any) {
        throw new Error(error.message || '注册失败')
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async loadUser() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        
        const data = await apiService.get('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (data.code === 200) {
          this.user = data.data
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    },

    async updateStatus(status: User['status']) {
      try {
        const token = localStorage.getItem('token')
        if (!token || !this.user) return
        
        const data = await apiService.put('/api/auth/status', { status }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (data.code === 200) {
          this.user.status = status
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    }
  }
})
