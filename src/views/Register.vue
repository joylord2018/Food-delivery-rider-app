<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from '../utils/toast'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 加载状态
const loading = ref(false)

// 注册方法
const handleRegister = async () => {
  // 表单验证
  if (!form.name) {
    toast.warning('请输入姓名')
    return
  }
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
  if (form.password !== form.confirmPassword) {
    toast.warning('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await authStore.register(form.phone, form.password, form.name)
    toast.success('注册成功')
    router.push('/home')
  } catch (error: any) {
    toast.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <!-- 顶部背景 -->
    <div class="register-bg"></div>
    
    <!-- 注册卡片 -->
    <div class="register-card">
      <!-- 顶部标题 -->
      <div class="register-header">
        <h1 class="register-title">骑手端注册</h1>
        <p class="register-subtitle">欢迎加入骑手团队</p>
      </div>

      <!-- 表单区域 -->
      <div class="register-form">
        <!-- 姓名输入 -->
        <van-field
          v-model="form.name"
          placeholder="请输入姓名"
          left-icon="user-o"
          clearable
          class="form-field"
        />

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

        <!-- 确认密码输入 -->
        <van-field
          v-model="form.confirmPassword"
          type="password"
          placeholder="请确认密码"
          left-icon="lock"
          clearable
          show-password
          class="form-field"
        />

        <!-- 注册按钮 -->
        <van-button
          type="primary"
          block
          size="large"
          :loading="loading"
          @click="handleRegister"
          class="register-button"
        >
          注册
        </van-button>

        <!-- 登录链接 -->
        <div class="register-footer">
          <span>已有账号？</span>
          <a href="javascript:;" @click="goToLogin" class="login-link">立即登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

/* 顶部背景 */
.register-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border-radius: 0 0 20px 20px;
  z-index: 0;
}

/* 注册卡片 */
.register-card {
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

/* 注册标题 */
.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.register-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #323233;
  margin-bottom: 0.8rem;
}

.register-subtitle {
  font-size: 1.4rem;
  color: #969799;
}

/* 表单区域 */
.register-form {
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

/* 注册按钮 */
.register-button {
  margin-top: 2rem;
  height: 50px;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 25px;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border: none;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(25, 137, 250, 0.4);
}

/* 注册底部 */
.register-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.4rem;
  color: #969799;
}

.login-link {
  color: #1989fa;
  margin-left: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #36cfc9;
  text-decoration: underline;
}
</style>
