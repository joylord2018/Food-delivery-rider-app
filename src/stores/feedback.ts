import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface Rating {
  id: string
  orderId: string
  customerName: string
  customerAvatar: string
  rating: number // 评分1-5
  comment: string
  createTime: string
  reply?: string // 骑手回复
  replyTime?: string // 回复时间
}

export interface Feedback {
  id: string
  type: 'suggestion' | 'complaint' | 'other' // 反馈类型：建议、投诉、其他
  content: string // 反馈内容
  contactInfo?: string // 联系方式
  status: 'pending' | 'processing' | 'resolved' // 状态：待处理、处理中、已解决
  createTime: string
  processTime?: string // 处理时间
  processResult?: string // 处理结果
}

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    ratings: [] as Rating[],
    feedbacks: [] as Feedback[],
    loading: false
  }),

  actions: {
    // 获取评价列表
    async fetchRatings() {
      this.loading = true
      try {
        const data = await apiService.get('/api/ratings')
        
        if (data.code === 200) {
          this.ratings = data.data
        }
      } catch (error) {
        console.error('Failed to fetch ratings:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取反馈列表
    async fetchFeedbacks() {
      this.loading = true
      try {
        const data = await apiService.get('/api/feedbacks')
        
        if (data.code === 200) {
          this.feedbacks = data.data
        }
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error)
      } finally {
        this.loading = false
      }
    },

    // 回复评价
    async replyToRating(ratingId: string, reply: string) {
      this.loading = true
      try {
        const data = await apiService.post(`/api/ratings/${ratingId}/reply`, { reply })
        
        if (data.code === 200) {
          const rating = this.ratings.find(r => r.id === ratingId)
          if (rating) {
            rating.reply = reply
            rating.replyTime = new Date().toISOString()
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to reply to rating:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // 提交反馈
    async submitFeedback(feedbackData: {
      type: Feedback['type']
      content: string
      contactInfo?: string
    }) {
      this.loading = true
      try {
        const data = await apiService.post('/api/feedbacks', feedbackData)
        
        if (data.code === 200) {
          this.feedbacks.unshift(data.data)
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to submit feedback:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    // 平均评分
    averageRating: (state) => {
      if (state.ratings.length === 0) return 0
      const sum = state.ratings.reduce((acc, rating) => acc + rating.rating, 0)
      return parseFloat((sum / state.ratings.length).toFixed(1))
    },
    
    // 好评率（4分及以上）
    positiveRatingRate: (state) => {
      if (state.ratings.length === 0) return 0
      const positiveCount = state.ratings.filter(rating => rating.rating >= 4).length
      return Math.round((positiveCount / state.ratings.length) * 100)
    },
    
    // 待处理反馈数量
    pendingFeedbackCount: (state) => {
      return state.feedbacks.filter(feedback => feedback.status === 'pending').length
    }
  },


})
