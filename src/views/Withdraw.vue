<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWithdrawStore } from '../stores/withdraw'
import CustomDialog from '../components/CustomDialog.vue'
import CustomNavBar from '../components/CustomNavBar.vue'
import { toast } from '../utils/toast'

const withdrawStore = useWithdrawStore()

// 加载状态
const loading = ref(false)
const recordsLoading = ref(false)

// 表单数据
const withdrawAmount = ref(0)
const bankAccount = ref('')
const bankName = ref('')

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

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      withdrawStore.fetchAvailableBalance(),
      withdrawStore.fetchWithdrawRecords()
    ])
  } catch (error) {
    toast.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  recordsLoading.value = true
  try {
    await Promise.all([
      withdrawStore.fetchAvailableBalance(),
      withdrawStore.fetchWithdrawRecords()
    ])
    toast.success('刷新成功')
  } catch (error) {
    toast.error('刷新失败')
  } finally {
    recordsLoading.value = false
  }
}

// 提交提现申请
const submitWithdraw = async () => {
  // 表单验证
  if (withdrawAmount.value <= 0) {
    toast.error('请输入正确的提现金额')
    return
  }

  if (withdrawAmount.value < withdrawStore.minimumWithdrawAmount) {
    toast.error(`最低提现金额为¥${withdrawStore.minimumWithdrawAmount}`)
    return
  }

  if (withdrawAmount.value > withdrawStore.availableBalance) {
    toast.error('提现金额不能超过可用余额')
    return
  }

  if (!bankAccount.value.trim()) {
    toast.error('请输入银行卡号')
    return
  }

  if (!bankName.value.trim()) {
    toast.error('请输入银行名称')
    return
  }

  // 确认提现
  showDialog({
    title: '确认提现',
    message: `您确定要提现¥${withdrawAmount.value.toFixed(1)}到银行卡 ${bankAccount.value} 吗？\n预计${withdrawStore.processingTime}到账。`,
    type: 'confirm',
    onConfirm: async () => {
      loading.value = true
      try {
        const success = await withdrawStore.submitWithdrawRequest(
          withdrawAmount.value,
          bankAccount.value,
          bankName.value
        )
        
        if (success) {
          toast.success('提现申请已提交，正在处理中..')
          // 重置表单
          withdrawAmount.value = 0
        } else {
          toast.error('提现申请提交失败，请重试')
        }
      } catch (error) {
        toast.error('提现申请提交失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 取消提现申请
const cancelWithdraw = (recordId: string) => {
  showDialog({
    title: '取消提现',
    message: '确定要取消该提现申请吗？',
    type: 'warning',
    onConfirm: async () => {
      loading.value = true
      try {
        const success = await withdrawStore.cancelWithdrawRequest(recordId)
        
        if (success) {
          toast.success('提现申请已取消')
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

const isAmountValid = computed(() => {
  return withdrawAmount.value > 0 && 
         withdrawAmount.value >= withdrawStore.minimumWithdrawAmount && 
         withdrawAmount.value <= withdrawStore.availableBalance
})

const getStatusText = (status: 'pending' | 'processing' | 'completed' | 'failed') => {
  switch (status) {
    case 'pending': return '待处理'
    case 'processing': return '处理中'
    case 'completed': return '已完成'
    case 'failed': return '失败'
    default: return '未知'
  }
}

const getStatusColor = (status: 'pending' | 'processing' | 'completed' | 'failed') => {
  switch (status) {
    case 'pending': return '#faad14'
    case 'processing': return '#1989fa'
    case 'completed': return '#07c160'
    case 'failed': return '#f5222d'
    default: return '#969799'
  }
}

// 页面挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="withdraw-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="提现" />

    <!-- 可提现余额卡片-->
    <van-skeleton :loading="loading" title :rows="2" animated>
      <div class="balance-card">
        <div class="balance-header">
          <h3 class="balance-title">可提现余额</h3>
          <div class="balance-amount">¥{{ withdrawStore.availableBalance.toFixed(1) }}</div>
        </div>
        <div class="balance-info">
          <span class="info-item">最低提现金额：¥{{ withdrawStore.minimumWithdrawAmount }}</span>
          <span class="info-item">预计到账时间：{{ withdrawStore.processingTime }}</span>
        </div>
      </div>
    </van-skeleton>

    <!-- 提现表单 -->
    <div class="withdraw-form-section">
      <div class="form-card">
        <h3 class="form-title">提现申请</h3>
        
        <div class="form-group">
          <label class="form-label">提现金额</label>
          <div class="amount-input-group">
            <span class="currency-symbol">¥</span>
            <van-field
              v-model="withdrawAmount"
              type="number"
              placeholder="请输入提现金额"
              :disabled="loading"
              class="amount-input"
              input-align="right"
            />
          </div>
          <div class="amount-hint">
            <span class="hint-text">可提现金额：¥{{ withdrawStore.availableBalance.toFixed(1) }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">银行卡号</label>
          <van-field
            v-model="bankAccount"
            placeholder="请输入银行卡号"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="form-label">银行名称</label>
          <van-field
            v-model="bankName"
            placeholder="请输入银行名称"
            :disabled="loading"
          />
        </div>

        <div class="form-actions">
          <van-button
            type="primary"
            block
            size="large"
            @click="submitWithdraw"
            :loading="loading"
            :disabled="!isAmountValid"
            class="submit-btn"
          >
            提交提现申请
          </van-button>
        </div>
      </div>
    </div>

    <!-- 提现记录 -->
    <div class="records-section">
      <div class="records-header">
        <h3 class="records-title">提现记录</h3>
        <van-icon
          name="replay"
          size="18"
          :loading="recordsLoading"
          @click="refreshData"
          class="refresh-icon"
        />
      </div>

      <van-skeleton :loading="recordsLoading" title :rows="5" animated>
        <div class="records-list">
          <van-empty
            v-if="withdrawStore.withdrawRecords.length === 0"
            description="暂无提现记录"
            image-size="100"
          >
            <template #bottom>
              <van-button type="primary" size="small" @click="refreshData">
                刷新记录
              </van-button>
            </template>
          </van-empty>
          <div v-else class="record-list">
            <div
              v-for="record in withdrawStore.withdrawRecords"
              :key="record.id"
              class="record-item"
            >
              <div class="record-left">
                <div class="record-header">
                  <span
                    class="record-status"
                    :style="{ backgroundColor: getStatusColor(record.status) }"
                  >
                    {{ getStatusText(record.status) }}
                  </span>
                  <span class="record-date">
                    {{ new Date(record.createTime).toLocaleString() }}
                  </span>
                </div>
                <div class="record-bank-info">
                  <span class="bank-name">{{ record.bankName }}</span>
                  <span class="bank-account">{{ record.bankAccount }}</span>
                </div>
                <div class="record-complete-time" v-if="record.completeTime">
                  完成时间：{{ new Date(record.completeTime).toLocaleString() }}
                </div>
              </div>
              <div class="record-right">
                <div class="record-amount">-¥{{ record.amount.toFixed(1) }}</div>
                <van-button
                  v-if="record.status === 'pending'"
                  type="danger"
                  size="small"
                  @click="cancelWithdraw(record.id)"
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

    <!-- 自定义弹窗组�?-->
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
/* 引入全局变量 */
@use '../variables' as *;

.withdraw-container {
  min-height: 100vh;
  background-color: $background-color;
  
  /* 顶部导航栏 */
  .custom-nav-bar {
    background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
    color: #fff;
    
    :deep(.van-nav-bar__title) {
      color: #fff;
      font-weight: 600;
    }
  }
  
  /* 可提现余额卡片 */
  .balance-card {
    background-color: $white;
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    .balance-header {
      margin-bottom: 1rem;
      
      .balance-title {
        font-size: 1.4rem;
        color: #646566;
        margin: 0 0 0.5rem 0;
      }
      
      .balance-amount {
        font-size: 3rem;
        font-weight: 600;
        color: $danger-color;
      }
    }
    
    .balance-info {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid $border-color;
      
      .info-item {
        font-size: 1.2rem;
        color: $text-color-secondary;
      }
    }
  }
  
  /* 提现表单 */
  .withdraw-form-section {
    padding: 0 1rem;
    
    .form-card {
      background-color: $white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      
      .form-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: $text-color;
        margin: 0 0 1.5rem 0;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
        
        .form-label {
          display: block;
          font-size: 1.4rem;
          font-weight: 500;
          color: $text-color;
          margin-bottom: 0.8rem;
        }
        
        .amount-input-group {
          position: relative;
          display: flex;
          align-items: center;
          
          .currency-symbol {
            position: absolute;
            left: 1rem;
            font-size: 1.6rem;
            font-weight: 600;
            color: $text-color;
            z-index: 1;
          }
          
          .amount-input {
            padding-left: 2.5rem !important;
            
            :deep(.van-field__control) {
              font-size: 1.8rem;
              font-weight: 600;
              color: $text-color;
            }
          }
        }
        
        .amount-hint {
          margin-top: 0.5rem;
          font-size: 1.2rem;
          color: $text-color-secondary;
          text-align: right;
        }
      }
      
      .form-actions {
        margin-top: 2rem;
        
        .submit-btn {
          border-radius: 25px;
          font-weight: 600;
          padding: 1rem 0;
          font-size: 1.5rem;
          background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
          border: none;
        }
      }
    }
  }
  
  /* 提现记录 */
  .records-section {
    margin-top: 1.5rem;
    padding: 0 1rem 1rem;
    
    .records-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      .records-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: $text-color;
        margin: 0;
      }
      
      .refresh-icon {
        cursor: pointer;
        color: $text-color-secondary;
        transition: all 0.3s ease;
        
        &:hover {
          color: $primary-color;
          transform: rotate(180deg);
        }
      }
    }
    
    .records-list {
      background-color: $white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      
      .record-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1.5rem;
        border-bottom: 1px solid $border-color;
        transition: all 0.3s ease;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: #fafafa;
        }
        
        .record-left {
          flex: 1;
          
          .record-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            
            .record-status {
              padding: 0.4rem 1rem;
              border-radius: 12px;
              font-size: 1.2rem;
              font-weight: 500;
              color: #fff;
            }
            
            .record-date {
              font-size: 1.2rem;
              color: $text-color-secondary;
            }
          }
          
          .record-bank-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
            
            .bank-name {
              font-size: 1.3rem;
              font-weight: 500;
              color: $text-color;
            }
            
            .bank-account {
              font-size: 1.3rem;
              color: #646566;
            }
          }
          
          .record-complete-time {
            font-size: 1.2rem;
            color: $text-color-secondary;
          }
        }
        
        .record-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.8rem;
          
          .record-amount {
            font-size: 1.8rem;
            font-weight: 600;
            color: $danger-color;
          }
          
          .cancel-btn {
            border-radius: 12px;
            font-size: 1.2rem;
            padding: 0.4rem 1rem;
          }
        }
      }
    }
  }
}
</style>
