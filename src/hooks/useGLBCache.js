// src/hooks/useGLBCache.js
import { useEffect, useState, useCallback } from 'react';
import glbCache from '../utils/glbCache';
import { preloadGLBFiles, manageCacheStorage } from '../utils/decompressor';

/**
 * Hook برای مدیریت Cache فایل‌های GLB
 */
export function useGLBCache() {
  const [cacheStats, setCacheStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * بروزرسانی آمار Cache
   */
  const refreshStats = useCallback(async () => {
    const stats = await glbCache.getStats();
    setCacheStats(stats);
    return stats;
  }, []);

  /**
   * پاک کردن تمام Cache
   */
  const clearAllCache = useCallback(async () => {
    setIsLoading(true);
    await glbCache.clear();
    await refreshStats();
    setIsLoading(false);
  }, [refreshStats]);

  /**
   * حذف یک فایل خاص
   */
  const deleteFile = useCallback(async (url) => {
    setIsLoading(true);
    await glbCache.delete(url);
    await refreshStats();
    setIsLoading(false);
  }, [refreshStats]);

  /**
   * پیش‌بارگذاری فایل‌ها
   */
  const preload = useCallback(async (urls) => {
    setIsLoading(true);
    const result = await preloadGLBFiles(urls);
    await refreshStats();
    setIsLoading(false);
    return result;
  }, [refreshStats]);

  /**
   * مدیریت خودکار Cache
   */
  const manageCache = useCallback(async () => {
    setIsLoading(true);
    await manageCacheStorage();
    await refreshStats();
    setIsLoading(false);
  }, [refreshStats]);

  /**
   * بررسی وجود فایل در Cache
   */
  const hasFile = useCallback(async (url) => {
    return await glbCache.has(url);
  }, []);

  // بارگذاری اولیه آمار
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    cacheStats,
    isLoading,
    refreshStats,
    clearAllCache,
    deleteFile,
    preload,
    manageCache,
    hasFile,
  };
}

/**
 * Hook برای پیش‌بارگذاری خودکار فایل‌های GLB
 * @param {string[]} urls - لیست URLهای فایل‌ها
 * @param {Object} options - تنظیمات
 */
export function useGLBPreload(urls, options = {}) {
  const {
    enabled = true,
    delay = 0,
    onComplete,
    onError,
  } = options;

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    if (!enabled || !urls || urls.length === 0) return;

    let mounted = true;

    const preload = async () => {
      // تاخیر اختیاری قبل از شروع
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      if (!mounted) return;

      setStatus('loading');
      setProgress({ loaded: 0, total: urls.length });

      try {
        let loadedCount = 0;

        for (const url of urls) {
          if (!mounted) break;

          try {
            // بررسی Cache
            const cached = await glbCache.has(url);
            
            if (!cached) {
              // اگر در Cache نیست، پیش‌بارگذاری کن
              const { preloadGLBFiles } = await import('../utils/decompressor');
              await preloadGLBFiles([url]);
            }

            loadedCount++;
            setProgress({ loaded: loadedCount, total: urls.length });
          } catch (err) {
            console.error(`خطا در پیش‌بارگذاری ${url}:`, err);
          }
        }

        if (mounted) {
          setStatus('success');
          onComplete?.();
        }
      } catch (error) {
        if (mounted) {
          setStatus('error');
          onError?.(error);
        }
      }
    };

    preload();

    return () => {
      mounted = false;
    };
  }, [urls, enabled, delay, onComplete, onError]);

  return {
    status,
    progress,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

/**
 * Hook برای مدیریت خودکار Cache (تمیز کردن دوره‌ای)
 * @param {Object} options - تنظیمات
 */
export function useAutoCacheManagement(options = {}) {
  const {
    enabled = true,
    interval = 24 * 60 * 60 * 1000, // 24 ساعت
    maxAge = 7, // روز
    maxSize = 100, // مگابایت
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const manage = async () => {
      console.log('🔧 مدیریت خودکار Cache...');
      
      // حذف فایل‌های قدیمی
      await glbCache.clearOldFiles(maxAge);
      
      // محدود کردن حجم
      await glbCache.limitCacheSize(maxSize);
      
      // نمایش آمار
      await glbCache.logCacheStats();
    };

    // اجرا در ابتدا
    manage();

    // اجرا به صورت دوره‌ای
    const intervalId = setInterval(manage, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, interval, maxAge, maxSize]);
}