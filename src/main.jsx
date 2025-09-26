import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './i18n'

// ✅ این خط رو اضافه کن اگر از vite-plugin-pwa استفاده می‌کنی
import { registerSW } from 'virtual:pwa-register'
import { ToastContainer } from 'react-toastify'
registerSW()  // به صورت autoUpdate یا optional

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/">
          {/* Toast Container در root برای نمایش toastها */}
<ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
      <App />
    </BrowserRouter>
  </StrictMode>
)
