import { defineStore } from 'pinia'
import { ref } from 'vue'

// 地图区域接口
export interface MapRegion {
  id: string
  name: string
  size: number
  code: string
}

// 已下载地图接口
export interface DownloadedMap {
  id: string
  name: string
  size: number
  updateAvailable: boolean
  lastUpdated: string
}

export const useOfflineMapStore = defineStore('offlineMap', () => {
  // 自动更新开关
  const autoUpdate = ref(true)

  // 地图区域列表
  const regions = ref<MapRegion[]>([
    { id: 'beijing', name: '北京市', size: 150, code: '110000' },
    { id: 'shanghai', name: '上海市', size: 120, code: '310000' },
    { id: 'guangzhou', name: '广州市', size: 100, code: '440100' },
    { id: 'shenzhen', name: '深圳市', size: 90, code: '440300' },
    { id: 'hangzhou', name: '杭州市', size: 80, code: '330100' }
  ])

  // 已下载地图列表
  const downloadedMaps = ref<DownloadedMap[]>([
    {
      id: 'beijing',
      name: '北京市',
      size: 150,
      updateAvailable: true,
      lastUpdated: '2024-01-01'
    }
  ])

  // 下载地图
  const downloadMap = async (regionId: string) => {
    // 模拟下载请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const region = regions.value.find(r => r.id === regionId)
        if (region) {
          const newMap: DownloadedMap = {
            id: region.id,
            name: region.name,
            size: region.size,
            updateAvailable: false,
            lastUpdated: (new Date().toISOString().split('T')[0]) as string
          }
          downloadedMaps.value.push(newMap)
        }
        resolve()
      }, 2000)
    })
  }

  // 删除地图
  const deleteMap = async (mapId: string) => {
    // 模拟删除请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const index = downloadedMaps.value.findIndex(m => m.id === mapId)
        if (index > -1) {
          downloadedMaps.value.splice(index, 1)
        }
        resolve()
      }, 500)
    })
  }

  // 更新地图
  const updateMap = async (mapId: string) => {
    // 模拟更新请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const map = downloadedMaps.value.find(m => m.id === mapId)
        if (map) {
          map.updateAvailable = false
          map.lastUpdated = (new Date().toISOString().split('T')[0]) as string
        }
        resolve()
      }, 2000)
    })
  }

  // 切换自动更新
  const toggleAutoUpdate = () => {
    autoUpdate.value = !autoUpdate.value
  }

  return {
    autoUpdate,
    regions,
    downloadedMaps,
    downloadMap,
    deleteMap,
    updateMap,
    toggleAutoUpdate
  }
})