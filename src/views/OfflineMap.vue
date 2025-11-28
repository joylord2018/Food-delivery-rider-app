<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOfflineMapStore } from '../stores/offlineMap'
import CustomDialog from '../components/CustomDialog.vue'
import CustomNavBar from '../components/CustomNavBar.vue'
import { toast } from '../utils/toast'

const offlineMapStore = useOfflineMapStore()

// 加载状态
const loading = ref(false)
const downloading = ref(false)

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

// 地图区域列表
const mapRegions = computed(() => offlineMapStore.regions)

// 已下载的地图
const downloadedMaps = computed(() => offlineMapStore.downloadedMaps)

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

// 下载地图
const downloadMap = async (regionId: string) => {
  showCustomDialog({
    title: '下载地图',
    message: '确定要下载该区域的离线地图吗？',
    onConfirm: async () => {
      downloading.value = true
      try {
        await offlineMapStore.downloadMap(regionId)
        toast.success('地图下载成功')
      } catch (error) {
        toast.error('地图下载失败')
      } finally {
        downloading.value = false
      }
    }
  })
}

// 删除地图
const deleteMap = async (mapId: string) => {
  showCustomDialog({
    title: '删除地图',
    message: '确定要删除该离线地图吗？',
    onConfirm: async () => {
      loading.value = true
      try {
        await offlineMapStore.deleteMap(mapId)
        toast.success('地图删除成功')
      } catch (error) {
        toast.error('地图删除失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 更新地图
const updateMap = async (mapId: string) => {
  downloading.value = true
  try {
    await offlineMapStore.updateMap(mapId)
    toast.success('地图更新成功')
  } catch (error) {
    toast.error('地图更新失败')
  } finally {
    downloading.value = false
  }
}

// 自动更新设置
const toggleAutoUpdate = async () => {
  offlineMapStore.toggleAutoUpdate()
  toast.info(offlineMapStore.autoUpdate ? '已开启自动更新' : '已关闭自动更新')
}
</script>

<template>
  <div class="offline-map-container">
    <!-- 顶部导航栏-->
    <CustomNavBar title="离线地图" />

    <!-- 自动更新设置 -->
    <div class="setting-item">
      <div class="setting-label">自动更新离线地图</div>
      <van-switch 
        v-model="offlineMapStore.autoUpdate" 
        size="24px"
        @change="toggleAutoUpdate"
      />
    </div>

    <!-- 已下载地图-->
    <div class="section">
      <div class="section-title">已下载地图</div>
      <div class="downloaded-maps">
        <div 
          v-for="map in downloadedMaps" 
          :key="map.id"
          class="map-item"
        >
          <div class="map-info">
            <div class="map-name">{{ map.name }}</div>
            <div class="map-size">{{ map.size }} MB</div>
            <div class="map-status" :class="{ 'update-available': map.updateAvailable }">
              {{ map.updateAvailable ? '有更新可用' : '已更新到最新' }}
            </div>
          </div>
          <div class="map-actions">
            <van-button 
              v-if="map.updateAvailable"
              type="primary" 
              size="small" 
              @click="updateMap(map.id)"
              :loading="downloading"
            >
              更新
            </van-button>
            <van-button 
              type="danger" 
              size="small" 
              @click="deleteMap(map.id)"
              :loading="loading"
            >
              删除
            </van-button>
          </div>
        </div>
        
        <!-- 空状�?-->
        <div v-if="downloadedMaps.length === 0" class="empty-state">
          <van-empty description="暂无已下载的离线地图" />
        </div>
      </div>
    </div>

    <!-- 可下载地图-->
    <div class="section">
      <div class="section-title">可下载地图</div>
      <div class="map-regions">
        <div 
          v-for="region in mapRegions" 
          :key="region.id"
          class="region-item"
        >
          <div class="region-info">
            <div class="region-name">{{ region.name }}</div>
            <div class="region-size">{{ region.size }} MB</div>
          </div>
          <van-button 
            type="primary" 
            size="small" 
            @click="downloadMap(region.id)"
            :loading="downloading"
          >
            下载
          </van-button>
        </div>
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

.offline-map-container {
  min-height: 100vh;
  background-color: $background-color;

  /* 顶部导航栏*/
  .custom-nav-bar {
    background: linear-gradient(135deg, $primary-color 0%, #36cfc9 100%);
    color: $white;

    :deep(.van-nav-bar__title) {
      color: $white;
      font-weight: 600;
    }

    :deep(.van-icon) {
      color: $white;
    }
  }

  /* 设置项*/
  .setting-item {
    background-color: $white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .setting-label {
      font-size: 1.5rem;
      color: $text-color;
    }
  }

  /* 区块 */
  .section {
    background-color: $white;
    padding: 1.5rem;
    margin-bottom: 1rem;

    .section-title {
      font-size: 1.6rem;
      font-weight: 600;
      color: $text-color;
      margin-bottom: 1.5rem;
    }

    /* 已下载地图 */
    .downloaded-maps {
      /* 空状态*/
      .empty-state {
        padding: 3rem 0;
      }
    }

    /* 地图项和区域项 */
    .map-item,
    .region-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .map-info,
      .region-info {
        flex: 1;

        .map-name,
        .region-name {
          font-size: 1.5rem;
          font-weight: 500;
          color: $text-color;
          margin-bottom: 0.5rem;
        }

        .map-size,
        .region-size {
          font-size: 1.3rem;
          color: $text-color-secondary;
          margin-bottom: 0.5rem;
        }

        .map-status {
          font-size: 1.2rem;
          color: $primary-color;

          &.update-available {
            color: $warning-color;
          }
        }
      }
    }
  }
}
</style>
