# 📨 Event & Asynchronous Flow Management

## 🚀 Real-Time Features  
- **Planned:** Yes, but **not implemented yet**  
- **Use Case:** Live leaderboard updates (or similar real-time interactions)  
- **Preferred Approach:** To be determined (e.g., WebSockets, Pusher, or Next.js Server Actions with polling)  

## ⏳ Background Jobs & Task Processing  
- **No async task processing for now** (No scheduled jobs, worker queues, or external task processing)  

## ⏭️ Future Considerations  
- When real-time features are added, the preferred method can be:  
  - **WebSockets** (Persistent connection for live updates)  
  - **Polling** (Short-term solution if needed)  
  - **Server Actions** (For periodic revalidation) 