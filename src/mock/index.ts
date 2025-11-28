// Mock data management module
// Centralizes all mock data for better maintainability

// Define mock data types
export interface MockResponse {
  code: number;
  message: string;
  data: any;
}

export interface MockRoute {
  url: string | RegExp;
  method: string;
  handler: (body?: any) => MockResponse;
}

// Authentication mock data
export const authMockRoutes: MockRoute[] = [
  {
    url: '/api/auth/login',
    method: 'POST',
    handler: (body: any) => ({
      code: 200,
      message: 'success',
      data: {
        token: 'mock-token-' + Date.now(),
        user: {
          id: '1',
          phone: body.phone,
          name: body.phone === '13800138000' ? '骑手小明' : '新骑手',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          status: 'online',
          rating: 4.8,
          ratingCount: 125,
          onTimeRate: 98.5,
          goodCommentRate: 95.2
        }
      }
    })
  },
  {
    url: '/api/auth/register',
    method: 'POST',
    handler: (body: any) => ({
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
    })
  },
  {
    url: '/api/auth/user',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
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
    })
  },
  {
    url: '/api/auth/status',
    method: 'PUT',
    handler: (body: any) => ({
      code: 200,
      message: 'success',
      data: {
        id: '1',
        phone: '13800138000',
        name: '骑手小明',
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        status: body.status,
        rating: 4.8,
        ratingCount: 125,
        onTimeRate: 98.5,
        goodCommentRate: 95.2
      }
    })
  }
];

// Earnings mock data
export const earningsMockRoutes: MockRoute[] = [
  {
    url: '/api/earnings/stats',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        totalEarnings: 12580.5,
        todayEarnings: 890.2,
        thisWeekEarnings: 5680.8,
        thisMonthEarnings: 12580.5
      }
    })
  },
  {
    url: '/api/earnings/records',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          date: '2024-01-15',
          amount: 150.5,
          taskId: 'task-001',
          type: 'delivery',
          description: '配送订单 #12345'
        },
        {
          id: '2',
          date: '2024-01-15',
          amount: 120.3,
          taskId: 'task-002',
          type: 'delivery',
          description: '配送订单 #12346'
        },
        {
          id: '3',
          date: '2024-01-14',
          amount: 200.8,
          taskId: 'task-003',
          type: 'delivery',
          description: '配送订单 #12347'
        }
      ]
    })
  }
];

// Weather mock data
export const weatherMockRoutes: MockRoute[] = [
  {
    url: '/api/weather',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        weather: {
          city: '北京市',
          temperature: 15,
          weather: '晴',
          windSpeed: '3级',
          humidity: '45%',
          updateTime: new Date().toLocaleString()
        },
        alerts: [
          {
            id: 'alert-001',
            title: '大风预警',
            description: '预计未来24小时内将有大风天气，请注意安全',
            level: 'warning',
            createTime: new Date().toLocaleString()
          },
          {
            id: 'alert-002',
            title: '高温预警',
            description: '预计未来3天最高气温将超过35℃，请注意防暑降温',
            level: 'danger',
            createTime: new Date(Date.now() - 3600000).toLocaleString()
          }
        ],
        safetyTips: [
          {
            id: 'tip-001',
            title: '大风天气配送注意事项',
            content: '大风天气下，请注意固定好餐箱，避免餐品掉落。骑行时请减速慢行，注意安全。',
            type: 'weather'
          },
          {
            id: 'tip-002',
            title: '高温天气防暑措施',
            content: '高温天气下，请注意补充水分，避免长时间暴露在阳光下。配送时可选择遮阳帽和防晒衣。',
            type: 'weather'
          },
          {
            id: 'tip-003',
            title: '雨天骑行安全',
            content: '雨天路滑，请减速慢行，保持安全车距。注意避让行人，确保餐品不受潮。',
            type: 'weather'
          },
          {
            id: 'tip-004',
            title: '夜间配送安全',
            content: '夜间配送时，请开启车灯，穿着反光衣物。选择明亮的路线，注意交通安全。',
            type: 'safety'
          }
        ]
      }
    })
  }
];

// Notifications mock data
export const notificationsMockRoutes: MockRoute[] = [
  {
    url: '/api/notifications',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          title: '新订单通知',
          message: '您有一个新的配送订单，请及时处理',
          type: 'order',
          isRead: false,
          createTime: new Date().toLocaleString()
        },
        {
          id: '2',
          title: '系统通知',
          message: '平台将于今晚进行维护，届时可能影响正常使用',
          type: 'system',
          isRead: true,
          createTime: new Date(Date.now() - 3600000).toLocaleString()
        }
      ]
    })
  },
  {
    url: /\/api\/notifications\/\w+\/read$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: '/api/notifications/read-all',
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  }
];

// Withdraw mock data
export const withdrawMockRoutes: MockRoute[] = [
  {
    url: '/api/withdraw/records',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          amount: 5000,
          status: 'completed',
          createTime: '2024-01-10',
          completeTime: '2024-01-11',
          bankAccount: '**** **** **** 1234',
          bankName: '中国银行'
        },
        {
          id: '2',
          amount: 3000,
          status: 'completed',
          createTime: '2024-01-05',
          completeTime: '2024-01-06',
          bankAccount: '**** **** **** 1234',
          bankName: '中国银行'
        }
      ]
    })
  },
  {
    url: '/api/withdraw/available',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        availableBalance: 12580.5,
        minimumWithdrawAmount: 50,
        processingTime: '1-3个工作日'
      }
    })
  },
  {
    url: '/api/withdraw/request',
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: /\/api\/withdraw\/\w+\/cancel$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  }
];

// Leave mock data
export const leaveMockRoutes: MockRoute[] = [
  {
    url: '/api/leave/requests',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          type: 'personal',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          reason: '个人原因',
          status: 'approved',
          createTime: '2024-01-15',
          approveTime: '2024-01-16',
          approverName: '管理员',
          remark: '批准'
        }
      ]
    })
  },
  {
    url: '/api/leave/request',
    method: 'POST',
    handler: (body: any) => ({
      code: 200,
      message: 'success',
      data: {
        id: '2',
        type: body.type,
        startDate: body.startDate,
        endDate: body.endDate,
        reason: body.reason,
        status: 'pending',
        createTime: new Date().toLocaleString()
      }
    })
  },
  {
    url: /\/api\/leave\/\w+\/cancel$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: /\/api\/leave\/\w+$/,
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        id: '1',
        type: 'personal',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        reason: '个人原因',
        status: 'approved',
        createTime: '2024-01-15',
        approveTime: '2024-01-16',
        approverName: '管理员',
        remark: '批准'
      }
    })
  }
];

// Ratings mock data
export const ratingsMockRoutes: MockRoute[] = [
  {
    url: '/api/ratings',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          customerName: '张三',
          customerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          rating: 5,
          comment: '骑手服务很好，速度很快',
          orderId: 'order-001',
          createTime: new Date().toLocaleString(),
          isLiked: false,
          likes: 0,
          reply: null
        }
      ]
    })
  },
  {
    url: '/api/feedbacks',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: []
    })
  },
  {
    url: /\/api\/ratings\/\w+\/reply$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: '/api/feedbacks',
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  }
];

// Community mock data
export const communityMockRoutes: MockRoute[] = [
  {
    url: '/api/community/posts',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        {
          id: '1',
          title: '骑手安全注意事项',
          content: '大家在配送过程中一定要注意安全，遵守交通规则',
          userAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          userName: '骑手小明',
          likes: 12,
          comments: 5,
          isLiked: false,
          createTime: new Date().toLocaleString(),
          tags: ['安全', '配送']
        }
      ]
    })
  },
  {
    url: /\/api\/community\/posts\/\w+$/,
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        id: '1',
        title: '骑手安全注意事项',
        content: '大家在配送过程中一定要注意安全，遵守交通规则',
        userAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        userName: '骑手小明',
        likes: 12,
        comments: 5,
        isLiked: false,
        createTime: new Date().toLocaleString(),
        tags: ['安全', '配送']
      }
    })
  },
  {
    url: '/api/community/posts',
    method: 'POST',
    handler: (body: any) => ({
      code: 200,
      message: 'success',
      data: {
        id: '2',
        title: body.title,
        content: body.content,
        userAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        userName: '骑手小明',
        likes: 0,
        comments: 0,
        isLiked: false,
        createTime: new Date().toLocaleString(),
        tags: body.tags
      }
    })
  },
  {
    url: /\/api\/community\/posts\/\w+\/like$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        likes: 13,
        isLiked: true
      }
    })
  },
  {
    url: '/api/community/comments',
    method: 'POST',
    handler: (body: any) => ({
      code: 200,
      message: 'success',
      data: {
        id: '1',
        content: body.content,
        userAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        userName: '骑手小明',
        likes: 0,
        isLiked: false,
        createTime: new Date().toLocaleString()
      }
    })
  },
  {
    url: /\/api\/community\/comments\/\w+\/like$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        likes: 1,
        isLiked: true
      }
    })
  }
];

// Statistics mock data
export const statisticsMockRoutes: MockRoute[] = [
  {
    url: /\/api\/statistics/,
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        totalEarnings: 12580.5,
        completedOrders: 156,
        workDuration: 4500,
        averageDeliveryTime: 28,
        onTimeRate: 98.5,
        goodCommentRate: 95.2,
        averageOrderEarnings: 80.7,
        deliveryTrend: [
          { label: '周一', value: 25 },
          { label: '周二', value: 30 },
          { label: '周三', value: 28 },
          { label: '周四', value: 35 },
          { label: '周五', value: 40 },
          { label: '周六', value: 45 },
          { label: '周日', value: 38 }
        ],
        incomeDistribution: [
          { label: '配送费', value: 10064.4, percentage: 80 },
          { label: '小费', value: 2516.1, percentage: 20 }
        ]
      }
    })
  }
];

// Tasks mock data
export const tasksMockRoutes: MockRoute[] = [
  {
    url: '/api/tasks',
    method: 'GET',
    handler: () => ({
      code: 200,
      message: 'success',
      data: [
        // 待接任务
        {
          id: 'task-001',
          orderId: 'order-12345',
          customerName: '李四',
          customerPhone: '13900139000',
          restaurantName: '麦当劳',
          restaurantAddress: '北京市朝阳区建国路88号',
          deliveryAddress: '北京市朝阳区建国路99号',
          distance: 2.5,
          fee: 15.5,
          status: 'pending',
          createTime: new Date().toLocaleString(),
          estimatedTime: 30,
          expectedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          notes: ['不要辣', '多加番茄酱']
        },
        {
          id: 'task-002',
          orderId: 'order-12346',
          customerName: '王五',
          customerPhone: '13800138001',
          restaurantName: '肯德基',
          restaurantAddress: '北京市朝阳区建国路77号',
          deliveryAddress: '北京市朝阳区建国路100号',
          distance: 1.8,
          fee: 12.0,
          status: 'pending',
          createTime: new Date(Date.now() - 5 * 60 * 1000).toLocaleString(),
          estimatedTime: 25,
          expectedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
          notes: ['少放糖', '尽快送达']
        },
        // 已接任务
        {
          id: 'task-003',
          orderId: 'order-12347',
          customerName: '赵六',
          customerPhone: '13700137000',
          restaurantName: '星巴克',
          restaurantAddress: '北京市朝阳区建国路66号',
          deliveryAddress: '北京市朝阳区建国路101号',
          distance: 3.2,
          fee: 18.5,
          status: 'accepted',
          createTime: new Date(Date.now() - 10 * 60 * 1000).toLocaleString(),
          estimatedTime: 35,
          expectedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
          notes: ['热饮', '加奶']
        },
        {
          id: 'task-004',
          orderId: 'order-12348',
          customerName: '孙七',
          customerPhone: '13600136000',
          restaurantName: '必胜客',
          restaurantAddress: '北京市朝阳区建国路55号',
          deliveryAddress: '北京市朝阳区建国路102号',
          distance: 2.1,
          fee: 14.0,
          status: 'accepted',
          createTime: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(),
          estimatedTime: 30,
          expectedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          notes: ['不要洋葱', '餐具两副']
        },
        // 已取餐
        {
          id: 'task-005',
          orderId: 'order-12349',
          customerName: '周八',
          customerPhone: '13500135000',
          restaurantName: '海底捞',
          restaurantAddress: '北京市朝阳区建国路44号',
          deliveryAddress: '北京市朝阳区建国路103号',
          distance: 4.5,
          fee: 22.0,
          status: 'picked',
          createTime: new Date(Date.now() - 20 * 60 * 1000).toLocaleString(),
          estimatedTime: 40,
          expectedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
          notes: ['火锅', '需要保温袋']
        },
        {
          id: 'task-006',
          orderId: 'order-12350',
          customerName: '吴九',
          customerPhone: '13400134000',
          restaurantName: '张亮麻辣烫',
          restaurantAddress: '北京市朝阳区建国路33号',
          deliveryAddress: '北京市朝阳区建国路104号',
          distance: 1.5,
          fee: 10.5,
          status: 'picked',
          createTime: new Date(Date.now() - 25 * 60 * 1000).toLocaleString(),
          estimatedTime: 25,
          expectedDeliveryTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          notes: ['多放麻酱', '不要香菜']
        },
        // 已完成
        {
          id: 'task-007',
          orderId: 'order-12351',
          customerName: '郑十',
          customerPhone: '13300133000',
          restaurantName: '全聚德',
          restaurantAddress: '北京市朝阳区建国路22号',
          deliveryAddress: '北京市朝阳区建国路105号',
          distance: 5.0,
          fee: 25.0,
          status: 'delivered',
          createTime: new Date(Date.now() - 60 * 60 * 1000).toLocaleString(),
          estimatedTime: 45,
          expectedDeliveryTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          notes: ['烤鸭', '需要手套']
        },
        {
          id: 'task-008',
          orderId: 'order-12352',
          customerName: '冯十一',
          customerPhone: '13200132000',
          restaurantName: '眉州东坡',
          restaurantAddress: '北京市朝阳区建国路11号',
          deliveryAddress: '北京市朝阳区建国路106号',
          distance: 3.0,
          fee: 16.5,
          status: 'delivered',
          createTime: new Date(Date.now() - 90 * 60 * 1000).toLocaleString(),
          estimatedTime: 35,
          expectedDeliveryTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
          notes: ['川菜', '少辣']
        },
        {
          id: 'task-009',
          orderId: 'order-12353',
          customerName: '陈十二',
          customerPhone: '13100131000',
          restaurantName: '吉野家',
          restaurantAddress: '北京市朝阳区建国路00号',
          deliveryAddress: '北京市朝阳区建国路107号',
          distance: 1.2,
          fee: 9.0,
          status: 'delivered',
          createTime: new Date(Date.now() - 120 * 60 * 1000).toLocaleString(),
          estimatedTime: 20,
          expectedDeliveryTime: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
          notes: ['牛肉饭', '加蛋']
        }
      ]
    })
  },
  {
    url: /\/api\/tasks\/\w+\/accept$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: /\/api\/tasks\/\w+\/pick$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: /\/api\/tasks\/\w+\/complete$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  },
  {
    url: /\/api\/tasks\/\w+\/cancel$/,
    method: 'POST',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {}
    })
  }
];

// Combine all mock routes
export const allMockRoutes = [
  ...authMockRoutes,
  ...earningsMockRoutes,
  ...weatherMockRoutes,
  ...notificationsMockRoutes,
  ...withdrawMockRoutes,
  ...leaveMockRoutes,
  ...ratingsMockRoutes,
  ...communityMockRoutes,
  ...statisticsMockRoutes,
  ...tasksMockRoutes
];

// Mock data manager class
export class MockDataManager {
  private routes: MockRoute[];
  
  constructor() {
    this.routes = allMockRoutes;
  }
  
  /**
   * Get mock data for a specific request
   * @param url - The request URL
   * @param method - The request method
   * @param body - The request body
   * @returns MockResponse - The mock response
   */
  getMockData(url: string, method: string, body?: any): MockResponse {
    // Find matching route
    const route = this.routes.find(route => {
      const urlMatch = typeof route.url === 'string' 
        ? route.url === url 
        : route.url.test(url);
      return urlMatch && route.method === method;
    });
    
    // If route found, call handler
    if (route) {
      return route.handler(body);
    }
    
    // Default response
    return {
      code: 200,
      message: 'success',
      data: {}
    };
  }
}

// Export a singleton instance
export const mockDataManager = new MockDataManager();
