// Storage Service for handling data persistence
// Uses localStorage with expiration and auto-refresh mechanism

// Define storage item type
export interface StorageItem {
  data: any;
  expiresAt: number; // Unix timestamp in milliseconds
  lastUpdated: number; // Unix timestamp in milliseconds
}

// Storage configuration
export interface StorageConfig {
  defaultExpiration: number; // Default expiration time in milliseconds
  autoRefresh: boolean; // Whether to auto-refresh expired data
}

// Default storage configuration
const DEFAULT_CONFIG: StorageConfig = {
  defaultExpiration: 24 * 60 * 60 * 1000, // 24 hours
  autoRefresh: true
};

export class StorageService {
  private config: StorageConfig;
  
  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Set data to localStorage with expiration
   * @param key - Storage key
   * @param data - Data to store
   * @param expiration - Optional expiration time in milliseconds
   */
  set(key: string, data: any, expiration?: number): void {
    const expiresAt = Date.now() + (expiration || this.config.defaultExpiration);
    const storageItem: StorageItem = {
      data,
      expiresAt,
      lastUpdated: Date.now()
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(storageItem));
    } catch (error) {
      console.error('Error storing data to localStorage:', error);
    }
  }
  
  /**
   * Get data from localStorage
   * @param key - Storage key
   * @returns any - Stored data if not expired, otherwise null
   */
  get(key: string): any | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item: StorageItem = JSON.parse(itemStr);
      
      // Check if data is expired
      if (Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Error getting data from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Remove data from localStorage
   * @param key - Storage key
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  }
  
  /**
   * Clear all data from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
  
  /**
   * Check if data exists and is not expired
   * @param key - Storage key
   * @returns boolean - True if data exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  /**
   * Get storage item with full metadata
   * @param key - Storage key
   * @returns StorageItem | null - Full storage item including expiration info
   */
  getItem(key: string): StorageItem | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      return JSON.parse(itemStr);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Refresh expired data by calling a refresh function
   * @param key - Storage key
   * @param refreshFn - Function to refresh the data
   * @param expiration - Optional expiration time for the refreshed data
   * @returns Promise<any> - Refreshed data
   */
  async refreshData<T>(key: string, refreshFn: () => Promise<T>, expiration?: number): Promise<T> {
    try {
      const data = await refreshFn();
      this.set(key, data, expiration);
      return data;
    } catch (error) {
      console.error(`Error refreshing data for key ${key}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
