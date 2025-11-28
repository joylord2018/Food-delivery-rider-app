<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeedbackStore } from '../stores/feedback'
import CustomNavBar from '../components/CustomNavBar.vue'
import { toast } from '../utils/toast'

const feedbackStore = useFeedbackStore()

// 加载状态
const submitting = ref(false)

// 表单数据
const feedbackForm = ref({
  type: 'suggestion' as 'suggestion' | 'complaint' | 'other',
  content: '',
  contactInfo: ''
})

// 提交反馈
const submitFeedback = async () => {
  if (!feedbackForm.value.content.trim()) {
    toast.error('请输入反馈内容')
    return
  }

  submitting.value = true
  try {
    const success = await feedbackStore.submitFeedback(feedbackForm.value)
    
    if (success) {
      toast.success('反馈提交成功，我们会尽快处理')
      // 重置表单
      feedbackForm.value = {
        type: 'suggestion',
        content: '',
        contactInfo: ''
      }
    } else {
      toast.error('提交失败，请重试')
    }
  } catch (error) {
    toast.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const isFormValid = computed(() => {
  return feedbackForm.value.content.trim().length > 0
})
</script>

<template>
  <div class="feedback-form-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="意见反馈" />

    <!-- 反馈表单 -->
    <div class="feedback-form-section">
      <div class="form-card">
        <h3 class="form-title">提交反馈</h3>
        
        <div class="form-group">
          <label class="form-label">反馈类型</label>
          <van-radio-group v-model="feedbackForm.type" direction="horizontal">
            <van-radio name="suggestion">建议</van-radio>
            <van-radio name="complaint">投诉</van-radio>
            <van-radio name="other">其他</van-radio>
          </van-radio-group>
        </div>

        <div class="form-group">
          <label class="form-label">反馈内容</label>
          <van-field
            v-model="feedbackForm.content"
            type="textarea"
            placeholder="请详细描述您的问题或建议"
            rows="6"
            :disabled="submitting"
          />
          <div class="form-hint">
            <span class="hint-text">请详细描述您的问题或建议，以便我们更好地为您服务</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">联系方式（选填）</label>
          <van-field
            v-model="feedbackForm.contactInfo"
            placeholder="请输入您的手机号或邮箱，方便我们联系您"
            :disabled="submitting"
          >
            <template #left-icon>
              <van-icon name="phone-o" />
            </template>
          </van-field>
        </div>

        <div class="form-actions">
          <van-button
            type="primary"
            block
            size="large"
            @click="submitFeedback"
            :loading="submitting"
            :disabled="!isFormValid"
            class="submit-btn"
          >
            提交反馈
          </van-button>
        </div>
      </div>
    </div>

    <!-- 反馈须知 -->
    <div class="feedback-notice-section">
      <div class="notice-card">
        <h3 class="notice-title">反馈须知</h3>
        <ul class="notice-list">
          <li class="notice-item">1. 请详细描述您的问题或建议，以便我们更好地为您服务</li>
          <li class="notice-item">2. 我们将在24小时内处理您的反馈</li>
          <li class="notice-item">3. 您可以留下联系方式，方便我们与您进一步沟通</li>
          <li class="notice-item">4. 请遵守相关法律法规，文明反馈</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.feedback-form-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏*/
.custom-nav-bar {
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  color: #fff;
}

.custom-nav-bar :deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
}

/* 反馈表单 */
.feedback-form-section {
  padding: 1rem;
}

.form-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  color: #323233;
  margin-bottom: 0.8rem;
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  color: #969799;
}

.form-actions {
  margin-top: 2rem;
}

.submit-btn {
  border-radius: 25px;
  font-weight: 600;
  padding: 1rem 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #1989fa 0%, #36cfc9 100%);
  border: none;
}

/* 反馈须知 */
.feedback-notice-section {
  padding: 0 1rem 1rem;
}

.notice-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.notice-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #323233;
  margin: 0 0 1rem 0;
}

.notice-list {
  padding-left: 1.5rem;
  margin: 0;
}

.notice-item {
  font-size: 1.3rem;
  color: #646566;
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.notice-item:last-child {
  margin-bottom: 0;
}
</style>
