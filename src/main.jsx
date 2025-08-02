import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './i18n'

// ✅ این خط رو اضافه کن اگر از vite-plugin-pwa استفاده می‌کنی
import { registerSW } from 'virtual:pwa-register'
registerSW()  // به صورت autoUpdate یا optional

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </StrictMode>
)
