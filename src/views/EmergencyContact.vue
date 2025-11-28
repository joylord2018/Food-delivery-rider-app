<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEmergencyStore } from '../stores/emergency'
import CustomDialog from '../components/CustomDialog.vue'
import CustomNavBar from '../components/CustomNavBar.vue'
import { toast } from '../utils/toast'

const emergencyStore = useEmergencyStore()

// 加载状态
const loading = ref(false)

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

// 紧急联系人列表
const contacts = computed(() => emergencyStore.contacts)

// 新联系人表单
const newContact = ref({
  name: '',
  phone: ''
})

// 编辑状态
const editingIndex = ref<number | null>(null)
const isEditing = computed(() => editingIndex.value !== null)

// 显示弹窗
const showCustomDialog = (config: {
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

// 添加/编辑联系人
const saveContact = async () => {
  if (!newContact.value.name || !newContact.value.phone) {
    toast.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    if (isEditing.value) {
      await emergencyStore.updateContact(editingIndex.value!, newContact.value)
      toast.success('联系人更新成功')
    } else {
      await emergencyStore.addContact(newContact.value)
      toast.success('联系人添加成功')
    }
    resetForm()
  } catch (error) {
    toast.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 删除联系人
const deleteContact = async (index: number) => {
  showCustomDialog({
    title: '删除联系人',
    message: '确定要删除这个紧急联系人吗？',
    onConfirm: async () => {
      loading.value = true
      try {
        await emergencyStore.deleteContact(index)
        toast.success('联系人删除成功')
      } catch (error) {
        toast.error('删除失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 编辑联系人
const editContact = (index: number) => {
  editingIndex.value = index
  const contact = contacts.value[index]
  if (contact) {
    newContact.value = {
      name: contact.name,
      phone: contact.phone
    }
  }
}

// 取消编辑
const cancelEdit = () => {
  resetForm()
}

// 重置表单
const resetForm = () => {
  editingIndex.value = null
  newContact.value = {
    name: '',
    phone: ''
  }
}
</script>

<template>
  <div class="emergency-contact-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="紧急联系人" />

    <!-- 联系人列表-->
    <div class="contact-list">
      <div 
        v-for="(contact, index) in contacts" 
        :key="index"
        class="contact-item"
      >
        <div class="contact-info">
          <div class="contact-name">{{ contact.name }}</div>
          <div class="contact-phone">{{ contact.phone }}</div>
        </div>
        <div class="contact-actions">
          <van-button 
            type="default" 
            size="small" 
            @click="editContact(index)"
          >
            编辑
          </van-button>
          <van-button 
            type="danger" 
            size="small" 
            @click="deleteContact(index)"
          >
            删除
          </van-button>
        </div>
      </div>
      
      <!-- 空状态-->
      <div v-if="contacts.length === 0" class="empty-state">
        <van-empty description="暂无紧急联系人" />
      </div>
    </div>

    <!-- 联系人表单-->
    <div class="contact-form">
      <div class="form-title">{{ isEditing ? '编辑联系人' : '添加联系人' }}</div>
      
      <van-cell-group>
        <van-field
          v-model="newContact.name"
          label="姓名"
          placeholder="请输入联系人姓名"
          clearable
        />
        <van-field
          v-model="newContact.phone"
          label="电话"
          placeholder="请输入联系人电话"
          type="tel"
          clearable
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button 
          v-if="isEditing" 
          type="default" 
          block 
          @click="cancelEdit"
        >
          取消
        </van-button>
        <van-button 
          type="primary" 
          block 
          :loading="loading" 
          @click="saveContact"
        >
          {{ isEditing ? '保存' : '添加' }}
        </van-button>
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
.emergency-contact-container {
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

.custom-nav-bar :deep(.van-icon) {
  color: #fff;
}

/* 联系人列表*/
.contact-list {
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fafafa;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background-color: #f0f2f5;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: 1.5rem;
  font-weight: 500;
  color: #323233;
  margin-bottom: 0.5rem;
}

.contact-phone {
  font-size: 1.3rem;
  color: #646566;
}

.contact-actions {
  display: flex;
  gap: 0.5rem;
}

/* 空状态*/
.empty-state {
  padding: 3rem 0;
}

/* 联系人表单*/
.contact-form {
  background-color: #fff;
  padding: 1rem;
}

.form-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #323233;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}
</style>
