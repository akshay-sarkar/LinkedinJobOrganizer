# 📋 Setup Checklist

## Backend Setup

### Prerequisites
- [ ] Node.js installed (v18 or higher)
- [ ] Gmail account
- [ ] Terminal/Command Prompt access

### Gmail Configuration
- [ ] Enable 2-Step Verification on Gmail
- [ ] Generate App Password for Gmail
- [ ] Save App Password securely

### Backend Installation
- [ ] Navigate to `backend` folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Copy environment file: `cp .env.example .env`
- [ ] Edit `.env` file with your Gmail credentials:
  - [ ] Add `GMAIL_USER=your-email@gmail.com`
  - [ ] Add `GMAIL_APP_PASSWORD=your-16-char-password`

### Test Backend
- [ ] Start server: `npm run dev`
- [ ] Verify server starts without errors
- [ ] Open browser to `http://localhost:5500`
- [ ] Test health endpoint: `http://localhost:5500/api/health`
- [ ] Test fetch jobs:
  ```bash
  curl -X POST http://localhost:5500/api/jobs/fetch -H "Content-Type: application/json" -d '{"limit": 5}'
  ```
- [ ] Verify jobs appear: `http://localhost:5500/api/jobs`

### Backend Status
- [ ] ✅ Database connected
- [ ] ✅ Tables created automatically
- [ ] ✅ Gmail connection working
- [ ] ✅ Jobs fetched successfully
- [ ] ✅ API endpoints responding

---

## Frontend Setup (Coming Next)

### Prerequisites
- [ ] Backend running on port 5500
- [ ] Node.js installed

### Frontend Installation (We'll do this next)
- [ ] Navigate to `frontend` folder
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Open browser to `http://localhost:5173`

### Frontend Features to Build
- [ ] Dashboard home page
- [ ] Job listing component
- [ ] Job card component
- [ ] Filters (company, location, status)
- [ ] Search functionality
- [ ] Statistics cards
- [ ] "Fetch New Jobs" button
- [ ] Mark as favorite/applied
- [ ] Job details modal

---

## Deployment (Optional - Later)

### Backend Deployment
- [ ] Choose hosting (Heroku, Railway, Render, etc.)
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Test production API

### Frontend Deployment
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Netlify/Vercel/Cloudflare Pages
- [ ] Update API endpoint to production URL
- [ ] Test production app

---

## Troubleshooting Checklist

### If server won't start
- [ ] Check Node.js is installed: `node --version`
- [ ] Check dependencies installed: `ls node_modules`
- [ ] Check `.env` file exists
- [ ] Check port 5500 is not in use: `lsof -i:5500`

### If Gmail connection fails
- [ ] Verify 2-Step Verification is enabled
- [ ] Check App Password is correct (no spaces)
- [ ] Check internet connection
- [ ] Try regenerating App Password

### If no jobs found
- [ ] Verify you have LinkedIn job alert emails
- [ ] Check emails are from `jobalerts-noreply@linkedin.com`
- [ ] Check emails are in inbox (not archived/deleted)
- [ ] Try marking some emails as unread

### If database errors
- [ ] Delete `backend/database/jobs.db`
- [ ] Restart server (will recreate database)

---

## Progress Tracking

**Completed:**
- [x] Project folder structure
- [x] Backend dependencies installed
- [x] Database configuration (Sequelize)
- [x] Job model (database schema)
- [x] Email service (Gmail IMAP)
- [x] Email parser service
- [x] Job controller (business logic)
- [x] API routes (6 endpoints)
- [x] Main server file
- [x] Testing documentation
- [x] Architecture documentation

**Current Task:**
- [ ] Test backend with your Gmail account
- [ ] Verify jobs are being fetched and stored

**Next Tasks:**
- [ ] Build React frontend
- [ ] Learn Tailwind CSS
- [ ] Create dashboard UI
- [ ] Connect frontend to backend
- [ ] Add filtering and search
- [ ] Polish and deploy

---

## Quick Reference Commands

### Backend
```bash
# Start backend server
cd backend
npm run dev

# Test API
curl http://localhost:5500/api/jobs
curl -X POST http://localhost:5500/api/jobs/fetch -H "Content-Type: application/json" -d '{"limit": 5}'

# View database
sqlite3 backend/database/jobs.db
SELECT * FROM jobs;
.exit
```

### Frontend (Coming Soon)
```bash
# Start frontend server
cd frontend
npm run dev

# Build for production
npm run build
```

### Both
```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend
npm run dev
```

---

## Support

If you get stuck:
1. Check `backend/TESTING.md` for detailed testing steps
2. Check `backend/ARCHITECTURE.md` for system flow
3. Read `BACKEND_SUMMARY.md` for overview
4. Review error messages carefully
5. Check `.env` file configuration

---

**Current Status:** ✅ Backend Complete, Ready to Test!
