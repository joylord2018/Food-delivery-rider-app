import { MockMethod } from 'vite-plugin-mock'

// Mock用户数据
const mockUser = {
  id: '1',
  phone: '13800138000',
  name: '骑手小明',
  avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
  status: 'online',
  rating: 4.8,
  ratingCount: 125,
  onTimeRate: 98.5,
  goodCommentRate: 95.2
}

export default [
  // 登录
  {
    url: '/api/auth/login',
    method: 'post',
    response: (req) => {
      const { phone, password } = req.body
      if (phone === '13800138000' && password === '123456') {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-token-' + Date.now(),
            user: mockUser
          }
        }
      } else {
        return {
          code: 401,
          message: '手机号或密码错误'
        }
      }
    }
  },
  
  // 注册
  {
    url: '/api/auth/register',
    method: 'post',
    response: (req) => {
      const { phone, password, name } = req.body
      if (phone && password && name) {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: '2',
              phone,
              name,
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              status: 'online',
              rating: 5.0,
              ratingCount: 0,
              onTimeRate: 100,
              goodCommentRate: 100
            }
          }
        }
      } else {
        return {
          code: 400,
          message: '注册信息不完整'
        }
      }
    }
  },
  
  // 获取用户信息
  {
    url: '/api/auth/user',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: mockUser
      }
    }
  },
  
  // 更新用户状态
  {
    url: '/api/auth/status',
    method: 'put',
    response: (req) => {
      const { status } = req.body
      mockUser.status = status
      return {
        code: 200,
        message: 'success',
        data: mockUser
      }
    }
  }
] as MockMethod[]