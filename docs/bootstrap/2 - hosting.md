# 🚀 Hosting & Deployment

## ☁️ Hosting & Infrastructure  
- **Hosting Provider:** Vercel (Hobby Plan)  
- **Database:** PostgreSQL (Hosted on Vercel)  
- **File Storage:** Cloudinary (For images)  
- **Authentication:** Auth.js (Google & GitHub OAuth)  

## 🔄 CI/CD Pipeline  
- **Deployment:** Automatic via Vercel (on Git push)  
- **Additional Steps:** No extra CI/CD steps for now (No testing, linting, or migrations before deploy)  

## 🏗️ Infrastructure as Code  
- **No `vercel.json` configuration used for now**  
- **No caching layer implemented yet**  

## 📈 Scaling & Performance  
- **No caching/CDN layers yet**  
- **Vercel Hobby Plan is used** (May require upgrade for high traffic in the future)  

## 🌍 Custom Domain & SSL  
- **Custom Domain:** `social-paroi.com`  
- **SSL:** Default Vercel-provided SSL (Free, automatic)  

## 🔐 Environment Variables & Secrets  
- **Managed via Vercel** (No external secret manager)  
