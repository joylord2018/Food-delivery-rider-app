<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '../stores/weather'
import { toast } from '../utils/toast'

const weatherStore = useWeatherStore()

// 加载状态
const loading = ref(false)
const refreshing = ref(false)

// 加载天气数据
const loadWeatherData = async () => {
  loading.value = true
  try {
    await weatherStore.fetchWeather()
  } catch (error) {
    toast.error('加载天气数据失败')
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  try {
    await weatherStore.fetchWeather()
    toast.success('天气数据已更新')
  } catch (error) {
    toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}



// 页面挂载时加载数据
onMounted(() => {
  loadWeatherData()
})
</script>

<template>
  <div class="weather-safety-container">
    <!-- 顶部导航栏-->
    <van-nav-bar 
      title="天气安全" 
      class="custom-nav-bar"
      left-arrow
      @click-left="() => $router.back()"
    />

    <!-- 天气信息卡片 -->
    <van-skeleton :loading="loading" title :rows="3" animated>
      <div class="weather-card" v-if="weatherStore.weather">
        <div class="weather-header">
          <div class="weather-info">
            <div class="city-name">{{ weatherStore.weather.city }}</div>
            <div class="temperature">{{ weatherStore.weather.temperature }}°C</div>
            <div class="weather-desc">{{ weatherStore.weather.weather }}</div>
          </div>
          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">风速</span>
              <span class="detail-value">{{ weatherStore.weather.windSpeed }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">湿度</span>
              <span class="detail-value">{{ weatherStore.weather.humidity }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ new Date(weatherStore.weather.updateTime).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-skeleton>

    <!-- 天气预警 -->
    <div class="alerts-section" v-if="weatherStore.alerts.length > 0">
      <div class="section-header">
        <h3 class="section-title">天气预警</h3>
      </div>
      <div class="alerts-list">
        <div
          v-for="alert in weatherStore.alerts"
          :key="alert.id"
          class="alert-item"
          :class="`alert-${alert.level}`"
        >
          <div class="alert-icon">
            <van-icon
              :name="alert.level === 'danger' ? 'warning-o' : alert.level === 'warning' ? 'info-o' : 'success-o'"
              :size="24"
            />
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-description">{{ alert.description }}</div>
            <div class="alert-time">{{ new Date(alert.createTime).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 安全提示 -->
    <div class="safety-tips-section">
      <div class="section-header">
        <h3 class="section-title">安全提示</h3>
      </div>
      <van-skeleton :loading="loading" title :rows="5" animated>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div class="safety-tips-list">
            <van-empty
              v-if="weatherStore.safetyTips.length === 0"
              description="暂无安全提示"
              image-size="100"
            >
              <template #bottom>
                <van-button type="primary" size="small" @click="loadWeatherData">
                  刷新提示
                </van-button>
              </template>
            </van-empty>
            <div v-else class="tips-list">
              <div
                v-for="tip in weatherStore.safetyTips"
                :key="tip.id"
                class="tip-item"
                :class="`tip-${tip.type}`"
              >
                <div class="tip-header">
                  <div class="tip-icon">
                    <van-icon
                      :name="tip.type === 'weather' ? 'cloud-o' : tip.type === 'traffic' ? 'car' : 'shield-o'"
                      :size="20"
                    />
                  </div>
                  <div class="tip-title">{{ tip.title }}</div>
                </div>
                <div class="tip-content">{{ tip.content }}</div>
              </div>
            </div>
          </div>
        </van-pull-refresh>
      </van-skeleton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 引入全局变量 */
@use '../variables' as *;

.weather-safety-container {
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
  
  /* 天气信息卡片 */
  .weather-card {
    background-color: $white;
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    .weather-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .weather-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        .city-name {
          font-size: 1.6rem;
          font-weight: 600;
          color: $text-color;
        }
        
        .temperature {
          font-size: 3.5rem;
          font-weight: 600;
          color: $danger-color;
        }
        
        .weather-desc {
          font-size: 1.4rem;
          color: #646566;
        }
      }
      
      .weather-details {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        text-align: right;
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          
          .detail-label {
            font-size: 1.2rem;
            color: $text-color-secondary;
          }
          
          .detail-value {
            font-size: 1.3rem;
            color: #646566;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  /* 通用区块样式 */
  .section-header {
    padding: 0 1rem;
    margin-bottom: 1rem;
    
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: $text-color;
      margin: 0;
    }
  }
  
  /* 天气预警 */
  .alerts-section {
    padding: 0 1rem 1rem;
    
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .alert-item {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
        
        &.alert-danger {
          background-color: #fff1f0;
          border-left: 4px solid $danger-color;
          
          :deep(.van-icon) {
            color: $danger-color;
          }
        }
        
        &.alert-warning {
          background-color: #fff7e6;
          border-left: 4px solid $warning-color;
          
          :deep(.van-icon) {
            color: $warning-color;
          }
        }
        
        &.alert-info {
          background-color: #e6f7ff;
          border-left: 4px solid $primary-color;
          
          :deep(.van-icon) {
            color: $primary-color;
          }
        }
        
        .alert-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        
        .alert-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          
          .alert-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: $text-color;
          }
          
          .alert-description {
            font-size: 1.3rem;
            color: #646566;
            line-height: 1.4;
          }
          
          .alert-time {
            font-size: 1.2rem;
            color: $text-color-secondary;
            margin-top: 0.3rem;
          }
        }
      }
    }
  }
  
  /* 安全提示 */
  .safety-tips-section {
    padding: 0 1rem 1rem;
    
    .safety-tips-list {
      background-color: $white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      
      .tips-list {
        padding: 0;
        
        .tip-item {
          padding: 1.5rem;
          border-bottom: 1px solid $border-color;
          transition: all 0.3s ease;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:hover {
            background-color: #fafafa;
          }
          
          &.tip-weather {
            border-left: 4px solid $primary-color;
            
            :deep(.van-icon) {
              color: $primary-color;
            }
          }
          
          &.tip-traffic {
            border-left: 4px solid $warning-color;
            
            :deep(.van-icon) {
              color: $warning-color;
            }
          }
          
          &.tip-safety {
            border-left: 4px solid $success-color;
            
            :deep(.van-icon) {
              color: $success-color;
            }
          }
          
          .tip-header {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            margin-bottom: 0.8rem;
            
            .tip-icon {
              flex-shrink: 0;
            }
            
            .tip-title {
              font-size: 1.4rem;
              font-weight: 600;
              color: $text-color;
            }
          }
          
          .tip-content {
            font-size: 1.3rem;
            color: #646566;
            line-height: 1.5;
          }
        }
      }
    }
  }
}
</style>
