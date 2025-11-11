// src/api/tokenStorage.secure.js
import CryptoJS from "crypto-js";

const ACCESS_KEY = "access_token";
const ENC_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
if (!ENC_KEY) throw new Error("VITE_ENCRYPTION_KEY is missing");

function encrypt(text) {
  return CryptoJS.AES.encrypt(String(text), ENC_KEY).toString();
}

function tryDecrypt(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENC_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || null;
  } catch {
    return null;
  }
}

export const tokenStorage = {
  getAccess: () => {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (!raw) return null;

    const decrypted = tryDecrypt(raw);
    if (decrypted) return decrypted;

    // migrate از plaintext → اگر raw واقعاً متن ساده بوده
    // اگر با کلید جدید decrypt نشد، منطقی‌تره پاک کنیم تا سیستم با توکن فاسد جلو نره
    // اگر می‌خوای یک‌بار مهاجرت بدی، این دو خط رو باز بذار؛ وگرنه پاک کن.
    // try { localStorage.setItem(ACCESS_KEY, encrypt(raw)); } catch {}
    localStorage.removeItem(ACCESS_KEY);
    return null;
  },

  setAccess: (t) => {
    const enc = encrypt(t);
    localStorage.setItem(ACCESS_KEY, enc);
  },

  clear: () => localStorage.removeItem(ACCESS_KEY),
};
