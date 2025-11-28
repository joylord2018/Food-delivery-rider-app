import { MockMethod } from 'vite-plugin-mock'

// Mock收益记录数据
const mockEarnings = [
  {
    id: '1',
    type: 'delivery',
    amount: 8.5,
    description: '配送订单 ORD001',
    date: new Date().toISOString()
  },
  {
    id: '2',
    type: 'delivery',
    amount: 9.0,
    description: '配送订单 ORD002',
    date: new Date().toISOString()
  },
  {
    id: '3',
    type: 'bonus',
    amount: 5.0,
    description: '完成10单奖励',
    date: new Date().toISOString()
  },
  {
    id: '4',
    type: 'delivery',
    amount: 7.5,
    description: '配送订单 ORD003',
    date: new Date().toISOString()
  },
  {
    id: '5',
    type: 'penalty',
    amount: -2.0,
    description: '超时送达罚款',
    date: new Date().toISOString()
  }
]

export default [
  // 获取收益统计
  {
    url: '/api/earnings/stats',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          totalEarnings: 12580.5,
          todayEarnings: 156.8,
          thisWeekEarnings: 890.2,
          thisMonthEarnings: 3560.5
        }
      }
    }
  },
  
  // 获取收益记录
  {
    url: '/api/earnings/records',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: mockEarnings
      }
    }
  },
  
  // 提现申请
  {
    url: '/api/earnings/withdraw',
    method: 'post',
    response: (req) => {
      const { amount } = req.body
      if (amount && amount > 0) {
        return {
          code: 200,
          message: '提现申请已提交，正在处理中',
          data: {
            orderId: 'WITHDRAW' + Date.now(),
            amount,
            status: 'pending',
            createTime: new Date().toISOString()
          }
        }
      } else {
        return {
          code: 400,
          message: '提现金额无效'
        }
      }
    }
  }
] as MockMethod[]