# 🎨 Front-End Design

## 🖥️ Frontend Framework & Styling  
- **Framework:** Next.js 14 (App Router)  
- **Styling:** Tailwind CSS (Dark mode supported)  
- **Authentication:** Auth.js (Google & GitHub OAuth)  

## ⚡ Rendering Strategy  
- **Hybrid Approach:**  
  - **Server-Side Rendering (SSR)** for some pages (e.g., Home Page)  
  - **Client-Side Rendering (CSR)** for dynamic components (e.g., Dashboard, Track Details)  

## 🎛️ State Management  
- **React’s built-in state management** (`useState`, `useContext`)  
- **No external state library (e.g., Redux, Zustand) for now**  

## 📁 Component Organization  
- **Feature-based structure** (`components/dashboard/TrackList.tsx`, `components/contest/ContestForm.tsx`)  

## ✅ Forms & Validation  
- **Zod** for validation  
- **No React Hook Form for now**  

## ⚠️ Error Handling & UI Feedback  
- **Global error boundary planned but not implemented yet**  
- **Notification system (e.g., `react-hot-toast`) not specified yet**  
