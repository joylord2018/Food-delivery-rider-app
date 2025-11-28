<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from '../utils/toast'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive({
  phone: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 登录方法
const handleLogin = async () => {
  // 表单验证
  if (!form.phone) {
    toast.warning('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    toast.warning('请输入正确的手机号')
    return
  }
  if (!form.password) {
    toast.warning('请输入密码')
    return
  }
  if (form.password.length < 6) {
    toast.warning('密码长度不能少于6位')
    return
  }

  loading.value = true
  try {
    await authStore.login(form.phone, form.password)
    toast.success('登录成功')
    router.push('/home')
  } catch (error: any) {
    toast.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <!-- 顶部背景 -->
    <div class="login-bg"></div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 顶部标题 -->
      <div class="login-header">
        <h1 class="login-title">骑手端登录</h1>
        <p class="login-subtitle">欢迎回来，骑手师傅</p>
      </div>

      <!-- 表单区域 -->
      <div class="login-form">
        <!-- 手机号输入-->
        <van-field
          v-model="form.phone"
          type="tel"
          placeholder="请输入手机号"
          left-icon="cellphone"
          clearable
          class="form-field"
        />

        <!-- 密码输入 -->
        <van-field
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          left-icon="lock"
          clearable
          show-password
          class="form-field"
        />

        <!-- 登录按钮 -->
        <van-button
          type="primary"
          block
          size="large"
          :loading="loading"
          @click="handleLogin"
          class="login-button"
        >
          登录
        </van-button>

        <!-- 注册链接 -->
        <div class="login-footer">
          <span>还没有账号？</span>
          <a href="javascript:;" @click="goToRegister" class="register-link">立即注册</a>
        </div>
      </div>
    </div>

    <!-- 示例账号提示 -->
    <div class="demo-account">
      <div class="demo-title">
        <van-icon name="info-o" size="16" color="#faad14" />
        <span>示例账号</span>
      </div>
      <div class="demo-content">
        <div class="demo-item">
          <span class="demo-label">手机号：</span>
          <span class="demo-value">13800138000</span>
        </div>
        <div class="demo-item">
          <span class="demo-label">密码：</span>
          <span class="demo-value">123456</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

/* 顶部背景 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border-radius: 0 0 20px 20px;
  z-index: 0;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  margin-top: 80px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 登录标题 */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #323233;
  margin-bottom: 0.8rem;
}

.login-subtitle {
  font-size: 1.4rem;
  color: #969799;
}

/* 表单区域 */
.login-form {
  width: 100%;
}

.form-field {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fafafa;
}

.form-field :deep(.van-field__control) {
  background-color: transparent;
  border-radius: 12px;
}

/* 登录按钮 */
.login-button {
  margin-top: 2rem;
  height: 50px;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 25px;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(25, 137, 250, 0.4);
}

/* 登录底部 */
.login-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.4rem;
  color: #969799;
}

.register-link {
  color: #1989fa;
  margin-left: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #36cfc9;
  text-decoration: underline;
}

/* 示例账号 */
.demo-account {
  width: 100%;
  max-width: 400px;
  background-color: #fff7e6;
  border: 1px solid #ffe58f;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.demo-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #faad14;
  margin-bottom: 1rem;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.demo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
}

.demo-label {
  color: #646566;
}

.demo-value {
  color: #323233;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
}
</style>
