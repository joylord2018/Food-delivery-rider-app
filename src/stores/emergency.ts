import { defineStore } from 'pinia'
import { ref } from 'vue'

// 紧急联系人接口
export interface EmergencyContact {
  name: string
  phone: string
}

// 报警记录接口
export interface EmergencyAlert {
  id: string
  timestamp: string
  location: { lat: number; lng: number }
  status: 'pending' | 'processing' | 'resolved'
}

export const useEmergencyStore = defineStore('emergency', () => {
  // 紧急联系人列表
  const contacts = ref<EmergencyContact[]>([
    { name: '家人', phone: '13800138000' },
    { name: '朋友', phone: '13900139000' }
  ])

  // 报警记录
  const alerts = ref<EmergencyAlert[]>([])

  // 一键报警
  const sendAlert = async () => {
    // 模拟发送报警请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newAlert: EmergencyAlert = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          location: { lat: 39.908823, lng: 116.397470 }, // 模拟当前位置
          status: 'pending'
        }
        alerts.value.unshift(newAlert)
        resolve()
      }, 1000)
    })
  }

  // 添加紧急联系人
  const addContact = async (contact: EmergencyContact) => {
    // 模拟API请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        contacts.value.push(contact)
        resolve()
      }, 500)
    })
  }

  // 更新紧急联系人
  const updateContact = async (index: number, contact: EmergencyContact) => {
    // 模拟API请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        contacts.value[index] = contact
        resolve()
      }, 500)
    })
  }

  // 删除紧急联系人
  const deleteContact = async (index: number) => {
    // 模拟API请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        contacts.value.splice(index, 1)
        resolve()
      }, 500)
    })
  }

  return {
    contacts,
    alerts,
    sendAlert,
    addContact,
    updateContact,
    deleteContact
  }
})