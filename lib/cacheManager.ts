// Cache manager for search results
interface CacheEntry {
  data: any[];
  timestamp: number;
  expiresAt: number;
}

interface SearchParams {
  year?: string;
  degree?: string;
  specialisation?: string;
  subject?: string;
  elective?: string;
  resourceType?: string;
}

class CacheManager {
  private static CACHE_PREFIX = 'acehive_search_';
  private static CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  private static MAX_CACHE_SIZE = 50; // Maximum number of cached entries

  // Generate cache key from search parameters
  private static generateCacheKey(params: SearchParams, resourceType: string): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result: any, key) => {
        if (params[key as keyof SearchParams]) {
          result[key] = params[key as keyof SearchParams];
        }
        return result;
      }, {});

    const paramString = JSON.stringify(sortedParams);
    return `${this.CACHE_PREFIX}${resourceType}_${btoa(paramString)}`;
  }

  // Get cached data
  static getCachedData(params: SearchParams, resourceType: string): any[] | null {
    try {
      const cacheKey = this.generateCacheKey(params, resourceType);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);
      const now = Date.now();

      // Check if cache has expired
      if (now > entry.expiresAt) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      console.log('Cache hit for:', cacheKey);
      return entry.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  // Store data in cache
  static setCachedData(params: SearchParams, resourceType: string, data: any[]): void {
    try {
      const cacheKey = this.generateCacheKey(params, resourceType);
      const now = Date.now();
      
      const entry: CacheEntry = {
        data,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      };

      localStorage.setItem(cacheKey, JSON.stringify(entry));
      console.log('Cached data for:', cacheKey);

      // Clean up old cache entries if we exceed max size
      this.cleanupCache();
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  // Clean up old cache entries
  private static cleanupCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      if (cacheKeys.length <= this.MAX_CACHE_SIZE) return;

      // Sort by timestamp (oldest first)
      const entries = cacheKeys.map(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry = JSON.parse(cached);
            return { key, timestamp: entry.timestamp };
          }
        } catch (error) {
          // Remove invalid entries
          localStorage.removeItem(key);
        }
        return null;
      }).filter(Boolean).sort((a, b) => a!.timestamp - b!.timestamp);

      // Remove oldest entries
      const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
      toRemove.forEach(entry => {
        if (entry) {
          localStorage.removeItem(entry.key);
          console.log('Removed old cache entry:', entry.key);
        }
      });
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }

  // Clear all cache
  static clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Cleared all cache entries');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Clear cache for specific resource type
  static clearCacheForResourceType(resourceType: string): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(`${this.CACHE_PREFIX}${resourceType}_`));
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Cleared cache for resource type: ${resourceType}`);
    } catch (error) {
      console.error('Error clearing cache for resource type:', error);
    }
  }

  // Get cache statistics
  static getCacheStats(): { totalEntries: number; totalSize: number } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      let totalSize = 0;
      cacheKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      });

      return {
        totalEntries: cacheKeys.length,
        totalSize: totalSize
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { totalEntries: 0, totalSize: 0 };
    }
  }
}

export default CacheManager;
