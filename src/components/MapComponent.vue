<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 坐标类型定义
interface Coordinate {
  lat: number
  lng: number
}

// 标记点类型定义
interface Marker {
  id: string
  type: 'restaurant' | 'delivery' | 'current'
  label: string
  lat: number
  lng: number
}

// 地图配置
const props = defineProps<{
  // 中心点坐标
  center?: Coordinate
  // 标记点列表
  markers?: Marker[]
  // 是否显示导航路线
  showRoute?: boolean
  // 导航路线坐标
  route?: Coordinate[]
}>()

// 地图状�?
const mapLoaded = ref(false)
const currentLocation = ref(props.center || { lat: 39.908823, lng: 116.397470 })
const zoom = ref(15)

// 模拟定位更新
const updateLocation = () => {
  // 模拟位置变化
  currentLocation.value = {
    lat: currentLocation.value.lat + (Math.random() - 0.5) * 0.001,
    lng: currentLocation.value.lng + (Math.random() - 0.5) * 0.001
  }
}

// 页面挂载时初始化地图
onMounted(() => {
  // 模拟地图加载
  setTimeout(() => {
    mapLoaded.value = true
  }, 1000)
  
  // 模拟实时定位更新（每2秒更新一次）
  setInterval(updateLocation, 2000)
})
</script>

<template>
  <div class="map-container">
    <!-- 地图加载状态-->
    <div v-if="!mapLoaded" class="map-loading">
      <van-loading type="spinner" color="#1989fa" size="40px" />
      <div class="loading-text">地图加载中..</div>
    </div>
    
    <!-- 地图内容 -->
    <div v-else class="map-content">
      <!-- 模拟地图背景 -->
      <div class="map-background" :style="{ transform: `scale(${zoom / 15})` }">
        <!-- 网格线-->
        <div class="map-grid"></div>
        
        <!-- 导航路线 -->
        <svg v-if="showRoute && route && route.length > 1" class="map-route">
          <polyline 
            :points="route.map((p: Coordinate) => `${(p.lng - currentLocation.lng + 0.01) * 10000},${(currentLocation.lat - p.lat + 0.01) * 10000}`).join(' ')" 
            fill="none" 
            stroke="#1989fa" 
            stroke-width="4" 
          />
        </svg>
        
        <!-- 标记点-->
        <div 
          v-for="(marker, index) in markers" 
          :key="index"
          class="map-marker"
          :class="marker.type"
          :style="{
            left: `${(marker.lng - currentLocation.lng + 0.01) * 10000}px`,
            top: `${(currentLocation.lat - marker.lat + 0.01) * 10000}px`
          }"
        >
          <van-icon 
            :name="marker.type === 'restaurant' ? 'shop-o' : marker.type === 'delivery' ? 'location-o' : 'location'" 
            size="24" 
          />
          <div class="marker-label">{{ marker.label }}</div>
        </div>
        
        <!-- 当前位置标记 -->
        <div class="current-location">
          <div class="location-pulse"></div>
          <van-icon name="location" size="24" color="#ee0a24" />
        </div>
      </div>
      
      <!-- 定位按钮 -->
      <div class="locate-btn">
        <van-button 
          type="primary" 
          round 
          icon="location" 
          @click="currentLocation = props.center || { lat: 39.908823, lng: 116.397470 }" 
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
}

/* 地图加载状态*/
.map-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}

.loading-text {
  font-size: 1.4rem;
  color: #969799;
}

/* 地图内容 */
.map-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 地图背景 */
.map-background {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  position: relative;
  transition: transform 0.3s ease;
  transform-origin: center;
}

/* 网格线*/
.map-grid {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  position: absolute;
  top: 0;
  left: 0;
}

/* 导航路线 */
.map-route {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 标记点*/
.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  z-index: 10;
}

.map-marker.restaurant {
  color: #1989fa;
}

.map-marker.delivery {
  color: #07c160;
}

.marker-label {
  font-size: 1.2rem;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 当前位置标记 */
.current-location {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.location-pulse {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #ee0a24;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 定位按钮 */
.locate-btn {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 30;
}
</style>
