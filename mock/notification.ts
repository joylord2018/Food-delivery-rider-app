import { MockMethod } from 'vite-plugin-mock'

// Mock通知数据
const mockNotifications = [
  {
    id: '1',
    title: '新订单通知',
    message: '您有一个新的配送订单，请及时处理。订单号：ORD001',
    type: 'order',
    isRead: false,
    createTime: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5分钟前
  },
  {
    id: '2',
    title: '系统维护通知',
    message: '系统将于明天凌晨2点进行维护，预计持续1小时，期间可能影响部分功能使用。',
    type: 'system',
    isRead: false,
    createTime: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30分钟前
  },
  {
    id: '3',
    title: '活动推送',
    message: '本周配送任务奖励翻倍，完成10单额外奖励50元！',
    type: 'activity',
    isRead: true,
    createTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2小时前
  },
  {
    id: '4',
    title: '订单超时提醒',
    message: '您的订单ORD002即将超时，请尽快配送。',
    type: 'order',
    isRead: true,
    createTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5小时前
  },
  {
    id: '5',
    title: '骑手评分更新',
    message: '您的最新评分已更新，当前评分为4.8分。',
    type: 'system',
    isRead: true,
    createTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1天前
  }
]

export default [
  // 获取通知列表
  {
    url: '/api/notifications',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: mockNotifications
      }
    }
  },
  
  // 标记通知为已读
  {
    url: '/api/notifications/:id/read',
    method: 'post',
    response: (req) => {
      const id = req.params.id
      const notification = mockNotifications.find(n => n.id === id)
      if (notification) {
        notification.isRead = true
        return {
          code: 200,
          message: 'success',
          data: notification
        }
      } else {
        return {
          code: 404,
          message: 'Notification not found'
        }
      }
    }
  },
  
  // 标记所有通知为已读
  {
    url: '/api/notifications/read-all',
    method: 'post',
    response: () => {
      mockNotifications.forEach(notification => {
        notification.isRead = true
      })
      return {
        code: 200,
        message: 'success',
        data: mockNotifications
      }
    }
  }
] as MockMethod[]