import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'system' | 'activity'
  isRead: boolean
  createTime: string
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0
  }),

  actions: {
    async fetchNotifications() {
      try {
        const data = await apiService.get('/api/notifications')
        
        if (data.code === 200) {
          this.notifications = data.data
          this.updateUnreadCount()
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        throw error
      }
    },

    async markAsRead(notificationId: string) {
      try {
        const data = await apiService.post(`/api/notifications/${notificationId}/read`, {})
        
        if (data.code === 200) {
          const notification = this.notifications.find(n => n.id === notificationId)
          if (notification) {
            notification.isRead = true
            this.updateUnreadCount()
          }
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        throw error
      }
    },

    async markAllAsRead() {
      try {
        const data = await apiService.post('/api/notifications/read-all', {})
        
        if (data.code === 200) {
          this.notifications.forEach(notification => {
            notification.isRead = true
          })
          this.updateUnreadCount()
        }
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
        throw error
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.isRead).length
    },

    // 添加新通知（用于模拟推送）
    addNotification(notification: Notification) {
      this.notifications.unshift(notification)
      this.updateUnreadCount()
    }
  },

  
})