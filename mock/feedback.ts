import { MockMethod } from 'vite-plugin-mock'

// 模拟评价数据
const mockRatings = [
  {
    id: '1',
    orderId: 'ORD001',
    customerName: '张三',
    customerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 5,
    comment: '骑手服务很好，配送速度快，餐品完好无损，非常满意！',
    createTime: '2024-01-18T12:30:00Z',
    reply: '感谢您的好评，我们会继续努力！',
    replyTime: '2024-01-18T13:45:00Z'
  },
  {
    id: '2',
    orderId: 'ORD002',
    customerName: '李四',
    customerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4,
    comment: '配送速度还可以，就是餐品有点凉了，希望下次改进。',
    createTime: '2024-01-17T18:20:00Z'
  },
  {
    id: '3',
    orderId: 'ORD003',
    customerName: '王五',
    customerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 5,
    comment: '骑手非常准时，服务态度好，很贴心地提醒我注意取餐，赞！',
    createTime: '2024-01-16T11:15:00Z',
    reply: '感谢您的认可，这是我们应该做的！',
    replyTime: '2024-01-16T14:20:00Z'
  },
  {
    id: '4',
    orderId: 'ORD004',
    customerName: '赵六',
    customerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 3,
    comment: '配送时间比预计晚了20分钟，联系骑手也不接电话，体验不太好。',
    createTime: '2024-01-15T19:45:00Z'
  },
  {
    id: '5',
    orderId: 'ORD005',
    customerName: '孙七',
    customerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 5,
    comment: '餐品包装完好，配送速度快，骑手服务态度很好，非常满意！',
    createTime: '2024-01-14T13:10:00Z'
  }
]

// 模拟反馈数据
const mockFeedbacks = [
  {
    id: '1',
    type: 'suggestion' as const,
    content: '建议增加夜间配送的奖励机制，鼓励更多骑手夜间接单。',
    contactInfo: '13800138000',
    status: 'resolved' as const,
    createTime: '2024-01-10T14:30:00Z',
    processTime: '2024-01-10T16:45:00Z',
    processResult: '感谢您的建议，我们已经在考虑增加夜间配送奖励机制，预计下周上线。'
  },
  {
    id: '2',
    type: 'complaint' as const,
    content: '今天遇到一个商家态度很差，不愿意配合取餐，希望平台能加强对商家的管理。',
    status: 'processing' as const,
    createTime: '2024-01-15T09:20:00Z'
  },
  {
    id: '3',
    type: 'other' as const,
    content: '希望能增加订单导航的语音提示功能，这样骑车的时候更安全。',
    contactInfo: 'feedback@example.com',
    status: 'pending' as const,
    createTime: '2024-01-18T10:15:00Z'
  }
]

export default [
  // 获取评价列表
  {
    url: '/api/ratings',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: mockRatings,
        message: 'success'
      }
    }
  },
  
  // 回复评价
  {
    url: '/api/ratings/(.*)/reply',
    method: 'post',
    response: (request) => {
      const ratingId = request.url.match(/\/api\/ratings\/(.*)\/reply/)?.[1]
      const { reply } = JSON.parse(request.body)
      
      if (ratingId) {
        const rating = mockRatings.find(r => r.id === ratingId)
        if (rating) {
          rating.reply = reply
          rating.replyTime = new Date().toISOString()
          return {
            code: 200,
            data: rating,
            message: '回复成功'
          }
        }
      }
      
      return {
        code: 404,
        message: '评价不存在'
      }
    }
  },
  
  // 获取反馈列表
  {
    url: '/api/feedbacks',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: mockFeedbacks,
        message: 'success'
      }
    }
  },
  
  // 提交反馈
  {
    url: '/api/feedbacks',
    method: 'post',
    response: (request) => {
      const { type, content, contactInfo } = JSON.parse(request.body)
      
      // 模拟创建新的反馈
      const newFeedback = {
        id: Date.now().toString(),
        type,
        content,
        contactInfo,
        status: 'pending' as const,
        createTime: new Date().toISOString()
      }
      
      mockFeedbacks.unshift(newFeedback)
      
      return {
        code: 200,
        data: newFeedback,
        message: '反馈提交成功'
      }
    }
  }
] as MockMethod[]
