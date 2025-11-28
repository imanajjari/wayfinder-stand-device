
# Shivacorp 3D Wayfinder

![Logo](./public/images/whiteLogo.webp)

A modern web application for **indoor 3D wayfinding**, designed for shopping malls, exhibitions, hospitals, airports, and other large indoor environments.  
Developed under **Shivacorp**  
Website: https://shivacorp.com

---
![baner](./public/images/settings/bg-settings.jpg)

## 🚀 Key Features

- Full **3D path visualization** using Three.js & React Three Fiber  
- **Multi-floor navigation** support  
- Destination search by **name** and **category**  
- Management of destinations, categories, amenities, and ads  
- File upload system (QR, images) with direct URL retrieval  
- **Full PWA support** with installable app experience  
- Ready for **Capacitor Android** build  
- Multi-language support (fa, en, ar)  
- Context-based global state management (Theme, Path, etc.)

---

## 🧩 Technologies Used
![baner](./public/images/settings/wayfinding-logo-green.png)

### Frontend
- React 19  
- Vite 6  
- TailwindCSS 4  
- React Router DOM v7  
- React Hook Form  
- React Toastify  
- React Icons  

### 3D Modules
- three  
- @react-three/fiber  
- @react-three/drei  
- r3f-perf  
- STL Loader  

### Mobile & PWA
- Capacitor Core / Android  
- vite-plugin-pwa  

### Multi-language
- i18next  
- react-i18next  

---

## 🗂️ Project Structure (src/)

```
src/
 ├── api/                     # Axios setup, interceptors, token handling
 ├── assets/                  # Static assets
 ├── components/              # All UI components
 │    ├── buttons/
 │    ├── cards/
 │    ├── common/
 │    ├── controls/
 │    ├── Gps/
 │    ├── layout/
 │    ├── Modal/
 │    ├── Models/
 │    ├── panels/
 │    ├── paths/
 │    ├── QRView/
 │    └── scene/
 ├── contexts/                # ThemeContext, PathContext, ModalManager, ...
 ├── features/                # Independent feature modules
 ├── hooks/                   # Custom React hooks
 ├── layouts/                 # Page layouts
 ├── lib/                     # Utility functions
 ├── locales/                 # Translations (fa, en, ar)
 ├── pages/                   # Main pages
 └── services/                # Communication with backend
```

---

## 🧭 Routes

```
/
├── Navigator3DPage      Main 3D navigation page
├── /resend             Refresh data
├── /setting            Application settings
├── /setting/reload     Reload configuration
├── /SnapShare/:slug    QR & shared path view
└── *                   404 page
```

---

## ⚙️ Getting Started

### Install dependencies
```
npm install
```

### Run development server
```
npm run dev
```

Access at:
```
http://localhost:5173
```

### Build production version
```
npm run build
```

### Preview production build
```
npm run preview
```

---

## 📱 PWA Support

- Auto-updating Service Worker  
- Image & asset caching  
- 192px and 512px icons  
- Complete manifest with Persian branding  

---

