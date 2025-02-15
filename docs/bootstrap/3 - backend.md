# ⚙️ Back-End Design

## 🏗️ Backend Framework & Architecture  
- **Framework:** Next.js 14 (App Router)  
- **API Structure:** Only **server-side functions** (Next.js API Routes)  
- **Database Access:** Prisma ORM (PostgreSQL)  
- **Authentication:** Auth.js (Google & GitHub OAuth)  
- **Architecture Pattern:** **Simple, flat structure** (No complex layering)  

## 🛡️ Security & Middleware  
- **Rate Limiting:** Enabled (`next-rate-limit`)  
- **CORS Policy:** Enforced (Restrict API access to frontend only)  

## ⚙️ Error Handling  
- **Global error handling middleware** to ensure consistent API responses  
- **Error format:** JSON `{ message, code }`  

## 🔄 Background Jobs  
- **No background jobs or async processing for now**  
- **No external task queue or cron jobs**  