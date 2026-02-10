// src/utils/glbCache.js
/**
 * سیستم Cache برای فایل‌های GLB با استفاده از IndexedDB
 * فایل‌های دانلود شده را ذخیره می‌کند تا در دفعات بعدی سریع‌تر بارگذاری شوند
 */

const DB_NAME = 'GLBCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'glbFiles';

class GLBCache {
  constructor() {
    this.db = null;
    this.initPromise = this.initDB();
  }

  /**
   * راه‌اندازی دیتابیس IndexedDB
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('❌ خطا در باز کردن IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB آماده شد');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // حذف store قدیمی در صورت وجود
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }

        // ساخت store جدید
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        
        // ایندکس برای جستجوی سریع‌تر
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('size', 'size', { unique: false });
        
        console.log('🔧 Store ایجاد شد');
      };
    });
  }

  /**
   * ذخیره فایل در Cache
   * @param {string} url - آدرس فایل
   * @param {ArrayBuffer} data - داده فایل
   * @param {boolean} isCompressed - آیا فایل فشرده است؟
   */
  async set(url, data, isCompressed = false) {
    try {
      await this.initPromise;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const cacheEntry = {
        url,
        data,
        isCompressed,
        timestamp: Date.now(),
        size: data.byteLength,
      };

      const request = store.put(cacheEntry);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`💾 فایل ذخیره شد: ${url} (${this.formatBytes(data.byteLength)})`);
          resolve(true);
        };

        request.onerror = () => {
          console.error('❌ خطا در ذخیره فایل:', request.error);
          reject(request.error);
        };

        transaction.oncomplete = () => {
          this.logCacheStats();
        };
      });
    } catch (error) {
      console.error('❌ خطا در set:', error);
      return false;
    }
  }

  /**
   * دریافت فایل از Cache
   * @param {string} url - آدرس فایل
   * @returns {Promise<{data: ArrayBuffer, isCompressed: boolean} | null>}
   */
  async get(url) {
    try {
      await this.initPromise;

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result;
          
          if (result) {
            console.log(`✅ فایل از Cache بارگذاری شد: ${url} (${this.formatBytes(result.size)})`);
            resolve({
              data: result.data,
              isCompressed: result.isCompressed,
            });
          } else {
            console.log(`ℹ️ فایل در Cache یافت نشد: ${url}`);
            resolve(null);
          }
        };

        request.onerror = () => {
          console.error('❌ خطا در خواندن از Cache:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ خطا در get:', error);
      return null;
    }
  }

  /**
   * بررسی وجود فایل در Cache
   * @param {string} url - آدرس فایل
   */
  async has(url) {
    const result = await this.get(url);
    return result !== null;
  }

  /**
   * حذف یک فایل از Cache
   * @param {string} url - آدرس فایل
   */
  async delete(url) {
    try {
      await this.initPromise;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(url);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`🗑️ فایل حذف شد: ${url}`);
          resolve(true);
        };

        request.onerror = () => {
          console.error('❌ خطا در حذف فایل:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ خطا در delete:', error);
      return false;
    }
  }

  /**
   * پاک کردن تمام Cache
   */
  async clear() {
    try {
      await this.initPromise;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log('🧹 تمام Cache پاک شد');
          resolve(true);
        };

        request.onerror = () => {
          console.error('❌ خطا در پاک کردن Cache:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ خطا در clear:', error);
      return false;
    }
  }

  /**
   * دریافت تمام URLهای ذخیره شده
   */
  async getAllKeys() {
    try {
      await this.initPromise;

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ خطا در getAllKeys:', error);
      return [];
    }
  }

  /**
   * دریافت اطلاعات آماری Cache
   */
  async getStats() {
    try {
      await this.initPromise;

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const items = request.result;
          const totalSize = items.reduce((sum, item) => sum + item.size, 0);
          const compressedCount = items.filter(item => item.isCompressed).length;

          resolve({
            count: items.length,
            totalSize,
            compressedCount,
            uncompressedCount: items.length - compressedCount,
            items: items.map(item => ({
              url: item.url,
              size: item.size,
              isCompressed: item.isCompressed,
              timestamp: item.timestamp,
            })),
          });
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ خطا در getStats:', error);
      return null;
    }
  }

  /**
   * نمایش آمار Cache در کنسول
   */
  async logCacheStats() {
    const stats = await this.getStats();
    
    if (stats) {
      console.log('📊 آمار Cache:');
      console.log(`   تعداد فایل‌ها: ${stats.count}`);
      console.log(`   حجم کل: ${this.formatBytes(stats.totalSize)}`);
      console.log(`   فشرده: ${stats.compressedCount}`);
      console.log(`   غیر فشرده: ${stats.uncompressedCount}`);
    }
  }

  /**
   * حذف فایل‌های قدیمی (بیش از X روز)
   * @param {number} days - تعداد روز
   */
  async clearOldFiles(days = 7) {
    try {
      const stats = await this.getStats();
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      const oldFiles = stats.items.filter(item => item.timestamp < cutoffTime);
      
      for (const file of oldFiles) {
        await this.delete(file.url);
      }

      console.log(`🧹 ${oldFiles.length} فایل قدیمی حذف شد`);
      return oldFiles.length;
    } catch (error) {
      console.error('❌ خطا در clearOldFiles:', error);
      return 0;
    }
  }

  /**
   * محدود کردن حجم Cache (حذف قدیمی‌ترین‌ها)
   * @param {number} maxSizeMB - حداکثر حجم به مگابایت
   */
  async limitCacheSize(maxSizeMB = 100) {
    try {
      const stats = await this.getStats();
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (stats.totalSize <= maxSizeBytes) {
        console.log('✅ حجم Cache در محدوده مجاز است');
        return;
      }

      // مرتب‌سازی بر اساس زمان (قدیمی‌ترین اول)
      const sortedItems = stats.items.sort((a, b) => a.timestamp - b.timestamp);
      
      let currentSize = stats.totalSize;
      let deletedCount = 0;

      for (const item of sortedItems) {
        if (currentSize <= maxSizeBytes) break;
        
        await this.delete(item.url);
        currentSize -= item.size;
        deletedCount++;
      }

      console.log(`🧹 ${deletedCount} فایل برای کاهش حجم Cache حذف شد`);
      console.log(`📦 حجم جدید: ${this.formatBytes(currentSize)}`);
    } catch (error) {
      console.error('❌ خطا در limitCacheSize:', error);
    }
  }

  /**
   * فرمت کردن حجم به واحد مناسب
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// ایجاد یک instance سراسری
const glbCache = new GLBCache();

export default glbCache;