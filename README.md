# Social Paroi

## 📌 Project Overview
Social Paroi is a **social sports tracking app** designed for users to track and manage their outdoor activity progress. The platform enables users to complete and rank tracks while offering features for competition and leaderboards.

## 🚀 Features

### 🏞️ Track Management
- Users can **view tracks**, mark them as **ToDo** or **Done**.
- Openers can **create and edit tracks**.

### 📊 Statistics & Rankings
- Users track **progress based on difficulty**.
- **Leaderboard** ranks users based on completed tracks.

### 🏆 Contests
- Openers can **create contests** with:
  - A set of tracks.
  - A list of participants.
  - Optional ranking criteria.
- Tracks earn points dynamically: **1000 ÷ (number of users who completed it)**.

### 📰 News System
- Admins can post **news updates**.

### 👥 User Roles
- **Regular Users**: View & complete tracks.
- **Openers**: Create and manage tracks & contests.
- **Admins**: Manage users and content.

## 📦 Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (Hosted on Vercel)
- **Authentication**: Auth.js (Google & GitHub OAuth)
- **Storage**: Cloudinary (For images)
- **Hosting**: Vercel

## 📂 Project Structure
<details>
<summary>click me</summary>

```
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
  /middleware  
  ├── auth.ts           # Role-based authentication  
  ├── rate-limit.ts     # API rate limiting  
  /services  
  ├── track.service.ts  # Track-related logic  
  ├── contest.service.ts # Contest management logic  
  ├── ranking.service.ts # Leaderboard logic  
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
  /prisma  
  ├── schema.prisma     # Prisma schema  
  ├── migrations/       # Database migrations  
  /env/                 # Environment variables  
  /.env                 # Local environment file  
  /package.json         # Project dependencies  
  /tsconfig.json        # TypeScript configuration  
  /next.config.js       # Next.js configuration  
  /vercel.json (opt.)   # Vercel configuration  
```
</details>

## 📖 Documentation
The complete project documentation is available in the `docs/bootstrap` directory:

| Document | Description |
|----------|-------------|
| [Goals](docs/bootstrap/1-goals.md) | Project goals and objectives |
| [Hosting](docs/bootstrap/2-hosting.md) | Hosting setup and deployment details |
| [Backend](docs/bootstrap/3-backend.md) | Backend structure and API details |
| [Frontend](docs/bootstrap/4-frontend.md) | Frontend implementation and UI components |
| [Database](docs/bootstrap/5-database.md) | Database schema and management |
| [Events](docs/bootstrap/6-events.md) | Event handling and async processing |
| [Security](docs/bootstrap/7-security.md) | Security policies and best practices |
| [Observability](docs/bootstrap/8-observability.md) | Logging, monitoring, and debugging |
| [Architecture](docs/bootstrap/9-architecture.md) | System architecture overview |
| [Next Steps](docs/bootstrap/10-next-steps.md) | Future improvements and roadmap |

## 🤝 Contributing

We welcome contributions from the community to help improve Social Paroi! Here’s how you can get involved:

1. **Create an Issue**  
   If you find a bug or have a feature request, please create an issue in our GitHub repository. Provide as much detail as possible to help us understand and address the issue.

2. **Answer the Feedback Form**  
   Share your thoughts and suggestions by filling out our [feedback form](https://forms.gle/p34UJeZjzkvmSRv58). Your feedback is invaluable in helping us improve the app.

3. **Fork and Create a Pull Request**  
   If you want to contribute code, follow these steps:
   - Fork the repository to your GitHub account.
   - Clone the forked repository to your local machine.
   - Create a new branch for your feature or bug fix.
   - Make your changes and commit them with clear and descriptive messages.
   - Push your changes to your forked repository.
   - Open a pull request to the main repository, describing the changes you’ve made and the issue it addresses.
   - Before proceeding, please ensure there is no existing issue related to your contribution and confirm its relevance to the project by consulting with the administrator. This will help prevent efforts on contributions that may not be accepted.

We appreciate your contributions and will review pull requests as quickly as possible. Thank you for helping make Social Paroi better!



## 📜 License
MIT License

---
Developed with ❤️ for the climbing community 🚀

