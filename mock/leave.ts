import { MockMethod } from 'vite-plugin-mock'

// 模拟请假记录数据
const mockLeaveRequests = [
  {
    id: '1',
    type: 'sick' as const,
    startDate: '2024-01-10T08:00:00Z',
    endDate: '2024-01-10T18:00:00Z',
    reason: '身体不适，需要休息一天',
    status: 'approved' as const,
    createTime: '2024-01-09T14:30:00Z',
    approveTime: '2024-01-09T15:45:00Z',
    approverName: '张经理',
    remark: '批准请假，注意休息'
  },
  {
    id: '2',
    type: 'personal' as const,
    startDate: '2024-01-15T13:00:00Z',
    endDate: '2024-01-15T18:00:00Z',
    reason: '家中有事，需要提前下班',
    status: 'approved' as const,
    createTime: '2024-01-14T10:20:00Z',
    approveTime: '2024-01-14T11:15:00Z',
    approverName: '张经理'
  },
  {
    id: '3',
    type: 'other' as const,
    startDate: '2024-01-20T08:00:00Z',
    endDate: '2024-01-22T18:00:00Z',
    reason: '需要处理个人事务，请假三天',
    status: 'pending' as const,
    createTime: '2024-01-18T09:10:00Z'
  }
]

export default [
  // 获取请假记录列表
  {
    url: '/api/leave/requests',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: mockLeaveRequests,
        message: 'success'
      }
    }
  },
  
  // 提交请假申请
  {
    url: '/api/leave/request',
    method: 'post',
    response: (request) => {
      const { type, startDate, endDate, reason } = JSON.parse(request.body)
      
      // 模拟创建新的请假记录
      const newRequest = {
        id: Date.now().toString(),
        type,
        startDate,
        endDate,
        reason,
        status: 'pending' as const,
        createTime: new Date().toISOString()
      }
      
      mockLeaveRequests.unshift(newRequest)
      
      return {
        code: 200,
        data: newRequest,
        message: '请假申请提交成功'
      }
    }
  },
  
  // 取消请假申请
  {
    url: '/api/leave/(.*)/cancel',
    method: 'post',
    response: (request) => {
      const requestId = request.url.match(/\/api\/leave\/(.*)\/cancel/)?.[1]
      
      if (requestId) {
        const requestIndex = mockLeaveRequests.findIndex(req => req.id === requestId)
        if (requestIndex !== -1) {
          // 只能取消待审批状态的请假
          if (mockLeaveRequests[requestIndex].status === 'pending') {
            mockLeaveRequests.splice(requestIndex, 1)
            return {
              code: 200,
              data: null,
              message: '请假申请取消成功'
            }
          } else {
            return {
              code: 400,
              data: null,
              message: '只能取消待审批状态的请假申请'
            }
          }
        }
      }
      
      return {
        code: 404,
        data: null,
        message: '请假记录不存在'
      }
    }
  },
  
  // 获取单个请假记录详情
  {
    url: '/api/leave/(.*)',
    method: 'get',
    response: (request) => {
      const requestId = request.url.match(/\/api\/leave\/(.*)/)?.[1]
      
      if (requestId) {
        const leaveRequest = mockLeaveRequests.find(req => req.id === requestId)
        if (leaveRequest) {
          return {
            code: 200,
            data: leaveRequest,
            message: 'success'
          }
        }
      }
      
      return {
        code: 404,
        data: null,
        message: '请假记录不存在'
      }
    }
  }
] as MockMethod[]
