// src/utils/decompressor.js
import pako from 'pako';
import glbCache from './glbCache';

export function isGzipCompressed(arrayBuffer) {
  const arr = new Uint8Array(arrayBuffer);
  return arr[0] === 0x1f && arr[1] === 0x8b;
}

export function decompressGzip(compressedData) {
  const uint8Array = new Uint8Array(compressedData);
  const decompressed = pako.ungzip(uint8Array);
  return decompressed.buffer;
}

export function createBlobURL(arrayBuffer) {
  const blob = new Blob([arrayBuffer], { type: 'model/gltf-binary' });
  return URL.createObjectURL(blob);
}

/**
 * بارگذاری فایل GLB با Cache
 * ابتدا از Cache می‌خواند، در صورت نبود دانلود می‌کند و Cache می‌کند
 * @param {string} url - آدرس فایل GLB
 * @returns {Promise<{blobUrl: string, fromCache: boolean}>}
 */
export async function loadGLBWithCache(url) {
  console.log(`🔍 بررسی Cache برای: ${url}`);

  try {
    // 1️⃣ بررسی وجود در Cache
    const cached = await glbCache.get(url);

    if (cached) {
      console.log('⚡ بارگذاری از Cache');
      
      // اگر فشرده بود، باز کن
      const finalData = cached.isCompressed 
        ? decompressGzip(cached.data)
        : cached.data;

      const blobUrl = createBlobURL(finalData);
      
      return {
        blobUrl,
        fromCache: true,
        size: finalData.byteLength,
      };
    }

    // 2️⃣ دانلود از شبکه
    console.log('🌐 دانلود از شبکه...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log(`📥 دانلود شد: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

    // 3️⃣ بررسی فشردگی
    const isCompressed = isGzipCompressed(arrayBuffer);
    
    // 4️⃣ ذخیره در Cache (قبل از باز کردن فشردگی)
    // این به ما اجازه می‌دهد فایل فشرده را نگه داریم که کوچک‌تر است
    await glbCache.set(url, arrayBuffer, isCompressed);

    // 5️⃣ باز کردن فشردگی در صورت نیاز
    const finalData = isCompressed 
      ? decompressGzip(arrayBuffer)
      : arrayBuffer;

    const blobUrl = createBlobURL(finalData);

    return {
      blobUrl,
      fromCache: false,
      size: finalData.byteLength,
      compressed: isCompressed,
    };

  } catch (error) {
    console.error('❌ خطا در loadGLBWithCache:', error);
    throw error;
  }
}

/**
 * پیش‌بارگذاری فایل‌های GLB
 * برای بارگذاری پیشگیرانه فایل‌هایی که ممکن است کاربر به آن‌ها نیاز داشته باشد
 * @param {string[]} urls - لیست آدرس فایل‌ها
 */
export async function preloadGLBFiles(urls) {
  console.log(`🚀 شروع پیش‌بارگذاری ${urls.length} فایل...`);

  const results = await Promise.allSettled(
    urls.map(url => loadGLBWithCache(url))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`✅ پیش‌بارگذاری کامل شد: ${successful} موفق، ${failed} ناموفق`);

  return {
    successful,
    failed,
    results,
  };
}

/**
 * مدیریت Cache - حذف فایل‌های قدیمی و محدود کردن حجم
 */
export async function manageCacheStorage() {
  console.log('🔧 مدیریت Cache...');
  
  // حذف فایل‌های بیش از 7 روز
  await glbCache.clearOldFiles(7);
  
  // محدود کردن حجم به 100 مگابایت
  await glbCache.limitCacheSize(100);
  
  // نمایش آمار
  await glbCache.logCacheStats();
}