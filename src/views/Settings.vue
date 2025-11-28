<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import CustomDialog from '../components/CustomDialog.vue'
import { toast } from '../utils/toast'

const router = useRouter()
const authStore = useAuthStore()

// 加载用户信息
const user = computed(() => authStore.user)

// 弹窗状态
const dialogVisible = ref(false)
const dialogConfig = ref({
  title: '',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  type: 'default' as 'default' | 'confirm' | 'warning' | 'danger',
  onConfirm: () => {}
})

// 显示弹窗
const showDialog = (config: {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'confirm' | 'warning' | 'danger'
  onConfirm: () => void
}) => {
  dialogConfig.value = {
    title: config.title,
    message: config.message,
    confirmText: config.confirmText || '确定',
    cancelText: config.cancelText || '取消',
    type: config.type || 'default',
    onConfirm: config.onConfirm
  }
  dialogVisible.value = true
}

// 处理弹窗确认
const handleDialogConfirm = () => {
  dialogConfig.value.onConfirm()
  dialogVisible.value = false
}

// 处理弹窗取消
const handleDialogCancel = () => {
  dialogVisible.value = false
}

// 个人信息设置
const editProfile = () => {
  toast.info('个人信息编辑功能开发中')
}

// 提现功能
const withdraw = () => {
  showDialog({
    title: '提现',
    message: `当前可提现金额：¥${12580.5.toFixed(1)}\n提现金额将在1-3个工作日内到账，确定要提现吗？`,
    type: 'confirm',
    onConfirm: async () => {
      try {
        const response = await fetch('/api/earnings/withdraw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: 12580.5 })
        })
        
        const data = await response.json()
        
        if (data.code === 200) {
          toast.success('提现申请已提交，正在处理中..')
        } else {
          toast.error(data.message || '提现失败')
        }
      } catch (error) {
        toast.error('提现失败')
      }
    }
  })
}

// 账户安全
const accountSecurity = () => {
  toast.info('账户安全功能开发中')
}

// 关于我们
const aboutUs = () => {
  toast.info('关于我们功能开发中')
}

// 退出登录
const logout = () => {
  showDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    type: 'warning',
    onConfirm: () => {
      authStore.logout()
      toast.success('退出登录成功')
      router.push('/login')
    }
  })
}
</script>

<template>
  <div class="settings-container">
    <!-- 顶部导航栏-->
    <van-nav-bar title="设置" />

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 个人信息卡片 -->
      <div class="profile-card" @click="editProfile">
        <van-image
          :src="user?.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'"
          round
          width="60"
          height="60"
          class="avatar"
        />
        <div class="profile-info">
          <div class="profile-name">{{ user?.name || '骑手' }}</div>
          <div class="profile-phone">{{ user?.phone || '' }}</div>
        </div>
        <van-icon name="arrow" size="16" color="#969799" />
      </div>

      <!-- 设置菜单 -->
      <div class="settings-menu">
        <!-- 账户设置 -->
        <van-cell-group inset>
          <van-cell title="个人信息" is-link @click="editProfile">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="提现" is-link @click="withdraw">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="账户安全" is-link @click="accountSecurity">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
        </van-cell-group>

        <!-- 工作相关 -->
      <van-cell-group inset class="mt-20">
        <van-cell title="多订单管理" is-link to="/multi-order">
          <template #right-icon>
            <van-icon name="arrow" size="16" color="#969799" />
          </template>
        </van-cell>
        <van-cell title="统计分析" is-link to="/statistics">
          <template #right-icon>
            <van-icon name="arrow" size="16" color="#969799" />
          </template>
        </van-cell>
        <van-cell title="请假申请" is-link to="/leave-request">
          <template #right-icon>
            <van-icon name="arrow" size="16" color="#969799" />
          </template>
        </van-cell>
      </van-cell-group>

        <!-- 安全与保障 -->
        <van-cell-group inset class="mt-20">
          <van-cell title="紧急联系人" is-link to="/emergency-contact">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="天气安全" is-link to="/weather-safety">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="离线地图" is-link to="/offline-map">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
        </van-cell-group>

        <!-- 评价与反馈 -->
        <van-cell-group inset class="mt-20">
          <van-cell title="评价列表" is-link to="/ratings">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="反馈表单" is-link to="/feedback">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
        </van-cell-group>

        <!-- 社区与更多 -->
        <van-cell-group inset class="mt-20">
          <van-cell title="骑手社区" is-link to="/community">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="关于我们" is-link @click="aboutUs">
            <template #right-icon>
              <van-icon name="arrow" size="16" color="#969799" />
            </template>
          </van-cell>
          <van-cell title="版本信息" value="v1.0.0" />
        </van-cell-group>
      </div>

      <!-- 退出登录按�?-->
      <div class="logout-container">
        <van-button type="danger" block size="large" @click="logout">
          退出登录
        </van-button>
      </div>

      <!-- 底部版权信息 -->
      <div class="copyright">
        © 2024 外卖骑手端 v1.0.0
      </div>
    </div>
    
    <!-- 自定义弹窗组件-->
    <CustomDialog
      v-model:visible="dialogVisible"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirm-text="dialogConfig.confirmText"
      :cancel-text="dialogConfig.cancelText"
      :type="dialogConfig.type"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../variables' as *;

.settings-container {
  height: 100%;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 可滚动内容区域 */
  .scrollable-content {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* 个人信息卡片 */
  .profile-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $white;
    padding: 2rem;
    margin: 1rem;
    border-radius: 0.8rem;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
    }

    .avatar {
      margin-right: 1.5rem;
    }

    .profile-info {
      flex: 1;

      .profile-name {
        font-size: 1.8rem;
        font-weight: 600;
        color: $text-color;
        margin-bottom: 0.5rem;
      }

      .profile-phone {
        font-size: 1.4rem;
        color: $text-color-secondary;
      }
    }
  }

  /* 设置菜单 */
  .settings-menu {
    padding: 0 1rem;
    margin-top: 1rem;

    .mt-20 {
      margin-top: 2rem;
    }
  }

  /* 退出登录按钮 */
  .logout-container {
    padding: 2rem 1rem;
    margin-top: 3rem;
  }

  /* 底部版权信息 */
  .copyright {
    text-align: center;
    font-size: 1.2rem;
    color: $text-color-secondary;
    padding: 1rem;
    margin-top: auto;
  }
}
</style>
