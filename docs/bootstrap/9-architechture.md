# 📁 Social Paroi – Final Architecture Summary  

## 📌 Project Overview  
- **Type:** Social Sports Tracking App  
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS  
- **Backend:** Next.js API Routes + Prisma ORM  
- **Database:** PostgreSQL (Hosted on Vercel)  
- **Authentication:** Auth.js (Google & GitHub OAuth)  
- **Storage:** Cloudinary (For images)  
- **Deployment:** Vercel (Hobby plan)  

---

## 🏗️ Folder Structure  

### 🌍 **App Router (`/app/`)**  
```plaintext
/app  
├── api/               # API Routes  
│   └── auth/  
│       └── [...nextauth]/route.ts  
├── contests/          # Contests pages  
│   ├── layout.tsx  
│   ├── page.tsx  
│   └── [contestId]/page.tsx  
├── dashboard/         # Main dashboard  
│   ├── layout.tsx  
│   ├── page.tsx  
│   └── track/[trackId]/  
│       ├── edit/page.tsx  
│       └── page.tsx  
├── login/page.tsx  
├── news/  
│   ├── layout.tsx  
│   └── page.tsx  
├── opener/  
│   ├── create/page.tsx  
│   └── layout.tsx  
├── ranking/  
│   ├── layout.tsx  
│   └── page.tsx  
├── stats/  
│   ├── layout.tsx  
│   └── page.tsx  
├── privacy/page.tsx  
├── layout.tsx         # Main app layout  
├── page.tsx           # Home page  
├── favicon.ico  
```

### 🧩 Components (/components/)
```plaintext
/components  
├── activities/        # Activity-related components  
├── contests/         # Contest-related components  
├── filters/          # Track filtering UI  
├── news/            # News-related components  
├── tracks/          # Track management components  
├── users/           # User-related components (Ranking, Stats)  
├── ui/              # Generic UI (buttons, modals, charts)  
├── Navbar.tsx       # Navigation bar  
├── Drawer.tsx       # Side drawer  
└── Zone.tsx  
```
### 🛠️ Backend Logic & Utilities
#### 🔒 Middleware (/middleware/)
```plaintext
/middleware  
├── auth.ts           # Role-based authentication  
├── rate-limit.ts     # API rate limiting  
```
#### 📂 Business Logic (/services/)
```plaintext
/services  
├── track.service.ts  # Track-related logic  
├── contest.service.ts # Contest management logic  
├── ranking.service.ts # Leaderboard logic  
```
#### 📦 Utilities & Helpers (/lib/)

````
  /lib  
  ├── cloudinary/       # Cloudinary helper functions  
  ├── contests/         # Contest-related actions & hooks  
  ├── news/             # News-related actions & hooks  
  ├── stats/            # Stats-related actions & hooks  
  ├── tracks/           # Track-related actions & hooks  
  ├── users/            # User-related actions & hooks  
  ├── prisma.ts         # Prisma client setup  
  ├── auth.ts           # Auth.js configuration  
  ├── logger.ts         # API error logging (to database)  
````

### 💾 Database & ORM (/prisma/)
```plaintext
/prisma  
├── schema.prisma     # Prisma schema  
├── migrations/       # Database migrations  
```

### 📦 Environment & Configuration
```plaintext
/env/                 # Environment variables  
/.env                 # Local environment file  
/package.json         # Project dependencies  
/tsconfig.json        # TypeScript configuration  
/next.config.js       # Next.js configuration  
/vercel.json (opt.)   # Vercel configuration  
```

### 🔐 Security & Performance
* Authentication: ✅ Auth.js (Google & GitHub OAuth)
* Rate Limiting: ✅ Enabled (next-rate-limit)
* CORS Protection: ✅ Restricted API access to frontend
* API Error Logging: ✅ Planned (To be stored in database)
* Global Error Boundary: ✅ Planned but not yet implemented
* Middleware for Role-Based Auth: ✅ Migration planned

### 📊 Observability & Maintenance
* Error Monitoring: ❌ No external service (Uses Vercel logs)
* Performance Monitoring: ❌ No real-time monitoring
* API Logging: ✅ API errors will be stored in the database
* Staging Environment: ✅ Enforced
* Zero-Downtime Deployments: ✅ Vercel’s default redeployment