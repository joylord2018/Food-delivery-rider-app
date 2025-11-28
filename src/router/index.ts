import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/task/:id',
      name: 'task-detail',
      component: () => import('@/views/TaskDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/earnings',
      name: 'earnings',
      component: () => import('@/views/Earnings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/customer-service',
      name: 'customer-service',
      component: () => import('@/views/CustomerService.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/order-history',
      name: 'order-history',
      component: () => import('@/views/OrderHistory.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notification-center',
      name: 'notification-center',
      component: () => import('@/views/NotificationCenter.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/multi-order',
      name: 'multi-order',
      component: () => import('@/views/MultiOrder.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/Statistics.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/emergency-contact',
      name: 'emergency-contact',
      component: () => import('@/views/EmergencyContact.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/offline-map',
      name: 'offline-map',
      component: () => import('@/views/OfflineMap.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () => import('@/views/Withdraw.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/leave-request',
      name: 'leave-request',
      component: () => import('@/views/LeaveRequest.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: () => import('@/views/RatingList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/FeedbackForm.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/weather-safety',
      name: 'weather-safety',
      component: () => import('@/views/WeatherSafety.vue'),
      meta: { requiresAuth: true }
    },
    { // 骑手社区
      path: '/community',
      name: 'community',
      component: () => import('@/views/Community.vue'),
      meta: { requiresAuth: true }
    },
    { // 帖子详情
      path: '/community/post/:id',
      name: 'post-detail',
      component: () => import('@/views/PostDetail.vue'),
      meta: { requiresAuth: true }
    },
    { // 发布帖子
      path: '/community/create',
      name: 'create-post',
      component: () => import('@/views/CreatePost.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 允许直接访问登录和注册页面
  if (to.name === 'login' || to.name === 'register') {
    next()
    return
  }
  
  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
