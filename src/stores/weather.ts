import { defineStore } from 'pinia'
import { apiService } from '../services/apiService'

export interface WeatherData {
  city: string
  temperature: number
  weather: string
  windSpeed: string
  humidity: string
  updateTime: string
}

export interface WeatherAlert {
  id: string
  title: string
  description: string
  level: 'warning' | 'danger' | 'info'
  createTime: string
}

export interface SafetyTip {
  id: string
  title: string
  content: string
  type: 'weather' | 'traffic' | 'safety'
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weather: null as WeatherData | null,
    alerts: [] as WeatherAlert[],
    safetyTips: [] as SafetyTip[],
    loading: false,
    lastUpdate: 0
  }),

  actions: {
    // 获取天气数据
    async fetchWeather() {
      this.loading = true
      try {
        // 禁用缓存，确保获取最新数据
        const data = await apiService.get('/api/weather', {}, { useCache: false })
        
        if (data.code === 200) {
          // 确保alerts和safetyTips是数组
          this.weather = data.data.weather
          this.alerts = data.data.alerts || []
          this.safetyTips = data.data.safetyTips || []
          this.lastUpdate = Date.now()
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error)
        // 出错时确保alerts和safetyTips是数组
        this.alerts = []
        this.safetyTips = []
      } finally {
        this.loading = false
      }
    },

    // 刷新天气数据（如果超过30分钟）
    async refreshWeatherIfNeeded() {
      const now = Date.now()
      if (now - this.lastUpdate > 30 * 60 * 1000) { // 30分钟
        await this.fetchWeather()
      }
    }
  },

  getters: {
    // 是否有紧急天气预警
    hasEmergencyAlert: (state) => {
      return state.alerts.some(alert => alert.level === 'danger')
    },
    
    // 今日天气概况
    weatherSummary: (state) => {
      if (!state.weather) return ''
      return `${state.weather.weather} ${state.weather.temperature}°C`
    }
  },


})
