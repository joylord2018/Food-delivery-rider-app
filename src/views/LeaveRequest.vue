<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLeaveStore } from '../stores/leave'
import CustomDialog from '../components/CustomDialog.vue'
import { toast } from '../utils/toast'
import { DatePicker as VanDatePicker } from 'vant'
import CustomNavBar from '../components/CustomNavBar.vue'

const leaveStore = useLeaveStore()

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const leaveForm = ref({
  type: 'personal' as 'sick' | 'personal' | 'other',
  startDate: '',
  endDate: '',
  reason: ''
})

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

// 日期选择器可见性
const startDatePickerVisible = ref(false)
const endDatePickerVisible = ref(false)

// 处理日期选择
const handleStartDateChange = (value: string[]) => {
  leaveForm.value.startDate = value.join(' ')
  startDatePickerVisible.value = false
}

const handleEndDateChange = (value: string[]) => {
  leaveForm.value.endDate = value.join(' ')
  endDatePickerVisible.value = false
}

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

// 加载请假记录
const loadLeaveRequests = async () => {
  loading.value = true
  try {
    await leaveStore.fetchLeaveRequests()
  } catch (error) {
    toast.error('加载请假记录失败')
  } finally {
    loading.value = false
  }
}

// 提交请假申请
const submitLeave = async () => {
  // 表单验证
  if (!leaveForm.value.startDate) {
    toast.error('请选择开始时间')
    return
  }

  if (!leaveForm.value.endDate) {
    toast.error('请选择结束时间')
    return
  }

  if (new Date(leaveForm.value.startDate) > new Date(leaveForm.value.endDate)) {
    toast.error('开始时间不能晚于结束时间')
    return
  }

  if (!leaveForm.value.reason.trim()) {
    toast.error('请输入请假原因')
    return
  }

  // 确认提交
  showDialog({
    title: '确认提交',
    message: `确定要提交${getLeaveTypeText(leaveForm.value.type)}申请吗？`,
    type: 'confirm',
    onConfirm: async () => {
      submitting.value = true
      try {
        const success = await leaveStore.submitLeaveRequest(leaveForm.value)
        
        if (success) {
          toast.success('请假申请已提交，等待审批')
          // 重置表单
          leaveForm.value = {
            type: 'personal',
            startDate: '',
            endDate: '',
            reason: ''
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
  })
}

// 取消请假申请
const cancelLeave = (requestId: string) => {
  showDialog({
    title: '取消申请',
    message: '确定要取消该请假申请吗？',
    type: 'warning',
    onConfirm: async () => {
      loading.value = true
      try {
        const success = await leaveStore.cancelLeaveRequest(requestId)
        
        if (success) {
          toast.success('请假申请已取消')
        } else {
          toast.error('取消失败，请重试')
        }
      } catch (error) {
        toast.error('取消失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取请假类型文本
const getLeaveTypeText = (type: 'sick' | 'personal' | 'other') => {
  switch (type) {
    case 'sick': return '病假'
    case 'personal': return '事假'
    case 'other': return '其他'
    default: return '未知类型'
  }
}

// 获取请假状态文本
const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'pending': return '待审批'
    case 'approved': return '已批准'
    case 'rejected': return '已拒绝'
    default: return '未知状态'
  }
}

// 获取请假状态颜色
const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'pending': return '#faad14'
    case 'approved': return '#07c160'
    case 'rejected': return '#f5222d'
    default: return '#969799'
  }
}

// 计算属性
const isFormValid = computed(() => {
  return leaveForm.value.startDate && 
         leaveForm.value.endDate && 
         leaveForm.value.reason.trim() &&
         new Date(leaveForm.value.startDate) <= new Date(leaveForm.value.endDate)
})

// 页面挂载时加载数据
onMounted(() => {
  loadLeaveRequests()
})
</script>

<template>
  <div class="leave-request-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="请假申请" />

    <!-- 可滚动内容区域 -->
    <div class="scrollable-content">
      <!-- 请假申请表单 -->
      <div class="leave-form-section">
        <div class="form-card">
          <h3 class="form-title">提交请假申请</h3>
          
          <div class="form-group">
            <label class="form-label">请假类型</label>
            <van-radio-group v-model="leaveForm.type" direction="horizontal">
              <van-radio name="personal">事假</van-radio>
              <van-radio name="sick">病假</van-radio>
              <van-radio name="other">其他</van-radio>
            </van-radio-group>
          </div>

          <div class="form-group">
            <label class="form-label">开始时间</label>
            <van-field
              v-model="leaveForm.startDate"
              placeholder="请选择开始时间"
              readonly
              @click="startDatePickerVisible = true"
            >
              <template #right-icon>
                <van-icon name="calendar-o" />
              </template>
            </van-field>
            <van-popup v-model:show="startDatePickerVisible" position="bottom">
              <van-date-picker
                type="datetime"
                @confirm="handleStartDateChange"
                @cancel="startDatePickerVisible = false"
              />
            </van-popup>
          </div>

          <div class="form-group">
            <label class="form-label">结束时间</label>
            <van-field
              v-model="leaveForm.endDate"
              placeholder="请选择结束时间"
              readonly
              @click="endDatePickerVisible = true"
            >
              <template #right-icon>
                <van-icon name="calendar-o" />
              </template>
            </van-field>
            <van-popup v-model:show="endDatePickerVisible" position="bottom">
              <van-date-picker
                type="datetime"
                @confirm="handleEndDateChange"
                @cancel="endDatePickerVisible = false"
              />
            </van-popup>
          </div>

          <div class="form-group">
            <label class="form-label">请假原因</label>
            <van-field
              v-model="leaveForm.reason"
              type="textarea"
              placeholder="请输入请假原因"
              rows="3"
            />
          </div>

          <div class="form-actions">
            <van-button
              type="primary"
              block
              size="large"
              @click="submitLeave"
              :loading="submitting"
              :disabled="!isFormValid"
              class="submit-btn"
            >
              提交申请
            </van-button>
          </div>
        </div>
      </div>

      <!-- 请假记录 -->
      <div class="leave-records-section">
        <div class="records-header">
          <h3 class="records-title">请假记录</h3>
          <van-icon
            name="replay"
            size="18"
            :loading="loading"
            @click="loadLeaveRequests"
            class="refresh-icon"
          />
        </div>

        <van-skeleton :loading="loading" title :rows="5" animated>
          <div class="records-list">
            <van-empty
              v-if="leaveStore.leaveRequests.length === 0"
              description="暂无请假记录"
              image-size="100"
            >
              <template #bottom>
                <van-button type="primary" size="small" @click="loadLeaveRequests">
                  刷新记录
                </van-button>
              </template>
            </van-empty>
            <div v-else class="record-list">
              <div
                v-for="request in leaveStore.leaveRequests"
                :key="request.id"
                class="record-item"
              >
                <div class="record-left">
                  <div class="record-header">
                    <span
                      class="record-status"
                      :style="{ backgroundColor: getStatusColor(request.status) }"
                    >
                      {{ getStatusText(request.status) }}
                    </span>
                    <span class="record-type">{{ getLeaveTypeText(request.type) }}</span>
                  </div>
                  <div class="record-date-range">
                    {{ new Date(request.startDate).toLocaleString() }} 至 {{ new Date(request.endDate).toLocaleString() }}
                  </div>
                  <div class="record-reason">{{ request.reason }}</div>
                  <div class="record-approve-info" v-if="request.approveTime">
                    <div class="approve-time">审批时间：{{ new Date(request.approveTime).toLocaleString() }}</div>
                    <div class="approver" v-if="request.approverName">审批人：{{ request.approverName }}</div>
                    <div class="approve-remark" v-if="request.remark">审批备注：{{ request.remark }}</div>
                  </div>
                </div>
                <div class="record-right">
                  <div class="record-create-time">
                    {{ new Date(request.createTime).toLocaleString() }}
                  </div>
                  <van-button
                    v-if="request.status === 'pending'"
                    type="danger"
                    size="small"
                    @click="cancelLeave(request.id)"
                    class="cancel-btn"
                  >
                    取消
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </van-skeleton>
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
.leave-request-container {
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 可滚动内容区域 */
.scrollable-content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 请假申请表单 */
.leave-form-section {
  padding: 0 1rem;
  margin-bottom: 1.5rem;
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

/* 请假记录 */
.leave-records-section {
  padding: 0 1rem 1rem;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.records-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin: 0;
}

.refresh-icon {
  cursor: pointer;
  color: #969799;
  transition: all 0.3s ease;
}

.refresh-icon:hover {
  color: #1989fa;
  transform: rotate(180deg);
}

.records-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #ebedf0;
  transition: all 0.3s ease;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background-color: #fafafa;
}

.record-left {
  flex: 1;
  margin-right: 1rem;
}

.record-header {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.record-status {
  padding: 0.4rem 1rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
}

.record-type {
  padding: 0.4rem 1rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #323233;
  background-color: #f0f2f5;
}

.record-date-range {
  font-size: 1.3rem;
  color: #646566;
  margin-bottom: 0.5rem;
}

.record-reason {
  font-size: 1.4rem;
  color: #323233;
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.record-approve-info {
  background-color: #fafafa;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #646566;
}

.approve-time, .approver, .approve-remark {
  margin-bottom: 0.5rem;
}

.approve-remark {
  color: #f5222d;
}

.record-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.8rem;
}

.record-create-time {
  font-size: 1.2rem;
  color: #969799;
}

.cancel-btn {
  border-radius: 12px;
  font-size: 1.2rem;
  padding: 0.4rem 1rem;
}
</style>
