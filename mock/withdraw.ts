import { MockMethod } from 'vite-plugin-mock'

// 模拟提现记录数据
const mockWithdrawRecords = [
  {
    id: '1',
    amount: 500.0,
    status: 'completed' as const,
    createTime: '2024-01-15T10:30:00Z',
    completeTime: '2024-01-16T14:20:00Z',
    bankAccount: '6222 **** **** 1234',
    bankName: '招商银行'
  },
  {
    id: '2',
    amount: 200.5,
    status: 'completed' as const,
    createTime: '2024-01-10T16:45:00Z',
    completeTime: '2024-01-11T09:15:00Z',
    bankAccount: '6222 **** **** 1234',
    bankName: '招商银行'
  },
  {
    id: '3',
    amount: 1000.0,
    status: 'processing' as const,
    createTime: '2024-01-18T08:20:00Z',
    bankAccount: '6222 **** **** 1234',
    bankName: '招商银行'
  },
  {
    id: '4',
    amount: 300.0,
    status: 'pending' as const,
    createTime: '2024-01-18T14:50:00Z',
    bankAccount: '6222 **** **** 1234',
    bankName: '招商银行'
  }
]

export default [
  // 获取可提现余额
  {
    url: '/api/withdraw/available',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: 12580.5,
        message: 'success'
      }
    }
  },
  
  // 获取提现记录
  {
    url: '/api/withdraw/records',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: mockWithdrawRecords,
        message: 'success'
      }
    }
  },
  
  // 提交提现申请
  {
    url: '/api/withdraw/request',
    method: 'post',
    response: (request) => {
      const { amount, bankAccount, bankName } = JSON.parse(request.body)
      
      // 模拟创建新的提现记录
      const newRecord = {
        id: Date.now().toString(),
        amount,
        status: 'pending' as const,
        createTime: new Date().toISOString(),
        bankAccount: bankAccount.replace(/\d{4}(?=\d{4}$)/g, ' **** '),
        bankName
      }
      
      mockWithdrawRecords.unshift(newRecord)
      
      return {
        code: 200,
        data: newRecord,
        message: '提现申请提交成功'
      }
    }
  },
  
  // 取消提现申请
  {
    url: '/api/withdraw/(.*)/cancel',
    method: 'post',
    response: (request) => {
      const recordId = request.url.match(/\/api\/withdraw\/(.*)\/cancel/)?.[1]
      
      if (recordId) {
        const recordIndex = mockWithdrawRecords.findIndex(record => record.id === recordId)
        if (recordIndex !== -1) {
          // 只能取消待处理状态的提现
          if (mockWithdrawRecords[recordIndex].status === 'pending') {
            mockWithdrawRecords.splice(recordIndex, 1)
            return {
              code: 200,
              data: null,
              message: '提现申请取消成功'
            }
          } else {
            return {
              code: 400,
              data: null,
              message: '只能取消待处理状态的提现申请'
            }
          }
        }
      }
      
      return {
        code: 404,
        data: null,
        message: '提现记录不存在'
      }
    }
  }
] as MockMethod[]
