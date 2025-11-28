import { API_CONFIG } from '../config/api'
import { mockDataManager } from '../mock/index'
import { storageService } from './storageService'

// API Service for handling all API requests
// Uses API_CONFIG to determine whether to use real API calls or mock data
// Integrates with storageService for caching API responses

export class ApiService {
  // Base URL for API calls
  private baseURL: string
  
  constructor() {
    this.baseURL = API_CONFIG.baseURL
  }
  
  /**
   * Make an API request with caching support
   * @param url - The API endpoint URL
   * @param options - Fetch options
   * @param cacheOptions - Cache configuration options
   * @returns Promise<any> - The response data
   */
  async request(url: string, options: RequestInit = {}, cacheOptions?: {
    cacheKey?: string;
    expiration?: number;
    useCache?: boolean;
  }): Promise<any> {
    const {
      cacheKey = `${options.method || 'GET'}_${url}`,
      expiration,
      useCache = options.method === 'GET' // Only cache GET requests by default
    } = cacheOptions || {};
    
    // Check cache first if caching is enabled and it's a GET request
    if (useCache) {
      const cachedData = storageService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    try {
      // 如果不使用真实API，直接返回模拟数据
      if (!API_CONFIG.useRealAPI) {
        const mockData = await this.getMockData(url, options);
        
        // Cache the mock data if caching is enabled
        if (useCache) {
          storageService.set(cacheKey, mockData, expiration);
        }
        
        return mockData;
      }
      
      // Construct full URL if using real API
      const fullUrl = `${this.baseURL}${url}`
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
      
      // Check if response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Parse and return JSON response
      const data = await response.json();
      
      // Cache the response data if caching is enabled
      if (useCache) {
        storageService.set(cacheKey, data, expiration);
      }
      
      return data;
    } catch (error) {
      console.error('API Request Error:', error)
      
      // 如果请求失败，尝试返回模拟数据
      if (!API_CONFIG.useRealAPI) {
        const mockData = await this.getMockData(url, options);
        
        // Cache the mock data if caching is enabled
        if (useCache) {
          storageService.set(cacheKey, mockData, expiration);
        }
        
        return mockData;
      }
      
      throw error;
    }
  }

  /**
   * 获取模拟数据
   * @param url - The API endpoint URL
   * @param options - Fetch options
   * @returns Promise<any> - The mock response data
   */
  private async getMockData(url: string, options: RequestInit = {}): Promise<any> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 解析请求体
    const body = options.body ? JSON.parse(options.body as string) : null
    
    // 使用集中管理的模拟数据管理器获取响应
    return mockDataManager.getMockData(url, options.method || 'GET', body)
  }

  /**
   * GET request
   * @param url - The API endpoint URL
   * @param options - Fetch options
   * @param cacheOptions - Cache configuration options
   * @returns Promise<any> - The response data
   */
  async get(url: string, options: RequestInit = {}, cacheOptions?: {
    cacheKey?: string;
    expiration?: number;
    useCache?: boolean;
  }): Promise<any> {
    return this.request(url, {
      ...options,
      method: 'GET'
    }, cacheOptions)
  }

  /**
   * POST request
   * @param url - The API endpoint URL
   * @param data - Request body data
   * @param options - Fetch options
   * @returns Promise<any> - The response data
   */
  async post(url: string, data: any, options: RequestInit = {}): Promise<any> {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT request
   * @param url - The API endpoint URL
   * @param data - Request body data
   * @param options - Fetch options
   * @returns Promise<any> - The response data
   */
  async put(url: string, data: any, options: RequestInit = {}): Promise<any> {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE request
   * @param url - The API endpoint URL
   * @param options - Fetch options
   * @returns Promise<any> - The response data
   */
  async delete(url: string, options: RequestInit = {}): Promise<any> {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    })
  }
}

// Export a singleton instance
export const apiService = new ApiService()
