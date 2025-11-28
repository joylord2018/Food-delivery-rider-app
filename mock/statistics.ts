import { MockMethod } from 'vite-plugin-mock'

// 生成随机数据
const generateRandomData = (range: string) => {
  let totalEarnings = 0
  let completedOrders = 0
  let workDuration = 0
  let deliveryTrend: any[] = []
  
  if (range === 'day') {
    // 今日数据
    completedOrders = Math.floor(Math.random() * 20) + 5
    totalEarnings = completedOrders * (Math.random() * 10 + 8)
    workDuration = Math.floor(Math.random() * 300) + 120 // 2-7小时
    
    // 今日趋势（按小时）
    deliveryTrend = Array.from({ length: 8 }, (_, i) => ({
      label: `${i + 8}:00`,
      value: Math.floor(Math.random() * 5) + 1
    }))
  } else if (range === 'week') {
    // 本周数据
    completedOrders = Math.floor(Math.random() * 100) + 50
    totalEarnings = completedOrders * (Math.random() * 10 + 8)
    workDuration = Math.floor(Math.random() * 1500) + 600 // 10-35小时
    
    // 本周趋势（按天）
    deliveryTrend = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => ({
      label: day,
      value: Math.floor(Math.random() * 20) + 5
    }))
  } else {
    // 本月数据
    completedOrders = Math.floor(Math.random() * 400) + 200
    totalEarnings = completedOrders * (Math.random() * 10 + 8)
    workDuration = Math.floor(Math.random() * 6000) + 2400 // 40-140小时
    
    // 本月趋势（按周）
    deliveryTrend = ['第1周', '第2周', '第3周', '第4周'].map(week => ({
      label: week,
      value: Math.floor(Math.random() * 100) + 30
    }))
  }
  
  // 计算其他数据
  const averageDeliveryTime = Math.floor(Math.random() * 20) + 20 // 20-40分钟
  const onTimeRate = Math.floor(Math.random() * 15) + 85 // 85-100%
  const goodCommentRate = Math.floor(Math.random() * 10) + 90 // 90-100%
  const averageOrderEarnings = totalEarnings / completedOrders
  
  // 收入分布
  const baseEarnings = totalEarnings * 0.7
  const bonusEarnings = totalEarnings * 0.2
  const subsidyEarnings = totalEarnings * 0.1
  
  const incomeDistribution = [
    { label: '基础配送费', value: baseEarnings, percentage: 70 },
    { label: '绩效奖金', value: bonusEarnings, percentage: 20 },
    { label: '补贴', value: subsidyEarnings, percentage: 10 }
  ]
  
  return {
    totalEarnings,
    completedOrders,
    workDuration,
    averageDeliveryTime,
    onTimeRate,
    goodCommentRate,
    averageOrderEarnings,
    deliveryTrend,
    incomeDistribution
  }
}

export default [
  // 获取统计数据
  {
    url: '/api/statistics',
    method: 'get',
    response: (req) => {
      const range = req.query.range || 'week'
      const data = generateRandomData(range as string)
      
      return {
        code: 200,
        message: 'success',
        data
      }
    }
  }
] as MockMethod[]