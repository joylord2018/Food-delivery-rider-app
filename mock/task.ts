import { MockMethod } from 'vite-plugin-mock'

// Mock任务数据
const mockTasks = [
  {
    id: '1',
    orderId: 'ORD001',
    customerName: '张三',
    customerPhone: '13800138001',
    restaurantName: '肯德基',
    restaurantAddress: '北京市朝阳区建国路88号',
    deliveryAddress: '北京市朝阳区建国路99号',
    distance: 1.2,
    fee: 8.5,
    status: 'pending',
    createTime: new Date().toISOString(),
    estimatedTime: 30,
    expectedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟后
    notes: ['不要辣', '多放番茄酱', '放门口即可，不用敲门']
  },
  {
    id: '2',
    orderId: 'ORD002',
    customerName: '李四',
    customerPhone: '13800138002',
    restaurantName: '麦当劳',
    restaurantAddress: '北京市朝阳区建国路88号',
    deliveryAddress: '北京市朝阳区建国路100号',
    distance: 1.5,
    fee: 9.0,
    status: 'pending',
    createTime: new Date().toISOString(),
    estimatedTime: 35,
    expectedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(), // 35分钟后
    notes: ['少冰', '不要吸管', '请尽快送达']
  },
  {
    id: '3',
    orderId: 'ORD003',
    customerName: '王五',
    customerPhone: '13800138003',
    restaurantName: '星巴克',
    restaurantAddress: '北京市朝阳区建国路88号',
    deliveryAddress: '北京市朝阳区建国路101号',
    distance: 0.8,
    fee: 7.5,
    status: 'accepted',
    createTime: new Date().toISOString(),
    estimatedTime: 25,
    expectedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15分钟后（即将超时）
    notes: ['热饮', '多加糖', '需要餐具', '放在前台']
  }
]

export default [
  // 获取任务列表
  {
    url: '/api/tasks',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: mockTasks
      }
    }
  },
  
  // 获取任务详情
  {
    url: '/api/tasks/:id',
    method: 'get',
    response: (req) => {
      const id = req.params.id
      const task = mockTasks.find(task => task.id === id)
      if (task) {
        return {
          code: 200,
          message: 'success',
          data: task
        }
      } else {
        return {
          code: 404,
          message: 'Task not found'
        }
      }
    }
  },
  
  // 接受任务
  {
    url: '/api/tasks/:id/accept',
    method: 'post',
    response: (req) => {
      const id = req.params.id
      const task = mockTasks.find(task => task.id === id)
      if (task) {
        task.status = 'accepted'
        return {
          code: 200,
          message: 'success',
          data: task
        }
      } else {
        return {
          code: 404,
          message: 'Task not found'
        }
      }
    }
  },
  
  // 确认取餐
  {
    url: '/api/tasks/:id/pick',
    method: 'post',
    response: (req) => {
      const id = req.params.id
      const task = mockTasks.find(task => task.id === id)
      if (task) {
        task.status = 'picked'
        return {
          code: 200,
          message: 'success',
          data: task
        }
      } else {
        return {
          code: 404,
          message: 'Task not found'
        }
      }
    }
  },
  
  // 确认送达
  {
    url: '/api/tasks/:id/complete',
    method: 'post',
    response: (req) => {
      const id = req.params.id
      const task = mockTasks.find(task => task.id === id)
      if (task) {
        task.status = 'delivered'
        return {
          code: 200,
          message: 'success',
          data: task
        }
      } else {
        return {
          code: 404,
          message: 'Task not found'
        }
      }
    }
  },
  
  // 取消订单
  {
    url: '/api/tasks/:id/cancel',
    method: 'post',
    response: (req) => {
      const id = req.params.id
      const task = mockTasks.find(task => task.id === id)
      if (task) {
        task.status = 'canceled'
        return {
          code: 200,
          message: 'success',
          data: task
        }
      } else {
        return {
          code: 404,
          message: 'Task not found'
        }
      }
    }
  }
] as MockMethod[]