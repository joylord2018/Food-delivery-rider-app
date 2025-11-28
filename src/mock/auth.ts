// 认证相关的Mock数据

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
};

// 登录请求处理
export const login = (body: { phone: string; password: string }) => {
  if (body.phone === '13800138000' && body.password === '123456') {
    return {
      code: 200,
      message: 'success',
      data: {
        token: 'mock-token-' + Date.now(),
        user: mockUser
      }
    };
  } else {
    return {
      code: 401,
      message: '手机号或密码错误'
    };
  }
};

// 注册请求处理
export const register = (body: { phone: string; password: string; name: string }) => {
  if (body.phone && body.password && body.name) {
    return {
      code: 200,
      message: 'success',
      data: {
        token: 'mock-token-' + Date.now(),
        user: {
          id: '2',
          phone: body.phone,
          name: body.name,
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          status: 'online',
          rating: 5.0,
          ratingCount: 0,
          onTimeRate: 100,
          goodCommentRate: 100
        }
      }
    };
  } else {
    return {
      code: 400,
      message: '注册信息不完整'
    };
  }
};

// 获取用户信息
export const getUser = () => {
  return {
    code: 200,
    message: 'success',
    data: mockUser
  };
};

// 更新用户状态
export const updateStatus = (body: { status: string }) => {
  return {
    code: 200,
    message: 'success',
    data: {
      ...mockUser,
      status: body.status
    }
  };
};

export default {
  login,
  register,
  getUser,
  updateStatus
};
