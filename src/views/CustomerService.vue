<script setup lang="ts">
import { ref } from 'vue'
import CustomDialog from '../components/CustomDialog.vue'
import { toast } from '../utils/toast'

// 活跃的折叠面板
const activeNames = ref(['0'])

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

// 常见问题数据
const faqs = [
  {
    title: '如何接单',
    content: '在首页的待接任务列表中，点击"立即接单"按钮即可接单。接单后，您可以在已接任务列表中查看任务详情。'
  },
  {
    title: '如何取消订单',
    content: '接单后，您可以在任务详情页面点击"取消订单"按钮取消订单。请注意，频繁取消订单可能会影响您的信用评分。'
  },
  {
    title: '如何查看收益',
    content: '在收益页面，您可以查看总收益、今日收益、本周收益和本月收益，以及详细的收益记录。'
  },
  {
    title: '如何提现',
    content: '在设置页面，点击"提现"按钮，按照提示操作即可提现。提现金额将在1-3个工作日内到账。'
  },
  {
    title: '如何修改个人信息',
    content: '在设置页面，点击"个人信息"按钮，即可修改您的姓名、手机号、头像等信息。'
  },
  {
    title: '如何联系客服',
    content: '您可以通过以下方式联系客服：\n1. 拨打客服电话：400-123-4567\n2. 在线客服：在客服页面点击"在线客服"按钮\n3. 邮件：service@example.com'
  }
]

// 拨打电话
const makeCall = () => {
  showDialog({
    title: '拨打电话',
    message: '确定要拨打客服电话：400-123-4567 吗？',
    type: 'confirm',
    onConfirm: () => {
      toast.info('正在拨打...')
      // 模拟拨打电话
    }
  })
}

// 在线客服
const onlineService = () => {
  toast.info('正在连接在线客服...')
  // 模拟连接在线客服
}
</script>

<template>
  <div class="customer-service-container">
    <!-- 顶部导航栏-->
    <van-nav-bar title="客服中心" left-arrow @click-left="() => $router.back()" />

    <!-- 联系客服卡片 -->
    <div class="contact-card">
      <div class="contact-title">联系客服</div>
      <div class="contact-methods">
        <div class="contact-item" @click="makeCall">
          <van-icon name="phone-o" size="24" color="#1989fa" />
          <div class="contact-text">客服电话</div>
          <div class="contact-detail">400-123-4567</div>
        </div>
        <div class="contact-item" @click="onlineService">
          <van-icon name="chat-o" size="24" color="#07c160" />
          <div class="contact-text">在线客服</div>
          <div class="contact-detail">24小时在线</div>
        </div>
      </div>
      
      <!-- 工作时间 -->
      <div class="working-hours">
        <div class="hours-title">工作时间</div>
        <div class="hours-content">
          <div>周一至周日</div>
          <div>08:00 - 22:00</div>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="faq-section">
      <div class="faq-title">常见问题</div>
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item 
          v-for="(faq, index) in faqs" 
          :key="index" 
          :title="faq.title" 
          :name="index.toString()"
        >
          <div class="faq-content">{{ faq.content }}</div>
        </van-collapse-item>
      </van-collapse>
    </div>

    <!-- 底部提示 -->
    <div class="bottom-tip">
      <van-icon name="info-o" color="#faad14" />
      <span>如有其他问题，请联系客服</span>
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
.customer-service-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.contact-card {
  background-color: var(--white);
  padding: 2rem;
  margin: 1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.contact-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.contact-methods {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background-color: var(--background-color);
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  margin: 0 0.5rem;
}

.contact-item:hover {
  background-color: #e8f4fd;
  transform: translateY(-2px);
}

.contact-text {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-color);
}

.contact-detail {
  font-size: 1.2rem;
  color: var(--text-color-secondary);
}

.working-hours {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background-color: var(--background-color);
  border-radius: 0.8rem;
}

.hours-title {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-color);
}

.hours-content {
  text-align: right;
  font-size: 1.2rem;
  color: var(--text-color-secondary);
}

.faq-section {
  background-color: var(--white);
  margin: 1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.faq-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-color);
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.faq-content {
  font-size: 1.3rem;
  color: var(--text-color);
  line-height: 1.6;
  white-space: pre-wrap;
}

.bottom-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  margin: 1rem;
  background-color: #fff7e6;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  color: #faad14;
}
</style>
