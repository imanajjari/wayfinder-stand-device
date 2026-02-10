// src/utils/decompressor.js
import pako from 'pako';

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
