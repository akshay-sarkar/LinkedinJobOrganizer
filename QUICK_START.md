# 🚀 Quick Start Guide

Get your LinkedIn Job Organizer up and running in 5 minutes!

---

## Prerequisites Checklist

- [ ] Node.js installed (v18+) - Check with: `node --version`
- [ ] Gmail account
- [ ] LinkedIn job alerts enabled in Gmail
- [ ] Terminal/Command Prompt

---

## Step 1: Gmail Configuration (5 minutes)

### Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**

### Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **"Other (Custom name)"**
3. Enter: `LinkedIn Job Organizer`
4. Click **Generate**
5. **Copy the 16-character password** (you won't see it again!)

📖 Detailed guide: [`plans/setup/gmail-setup.md`](plans/setup/gmail-setup.md)

---

## Step 2: Backend Setup (2 minutes)

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Edit .env file
# Add your Gmail credentials:
# GMAIL_USER=your-email@gmail.com
# GMAIL_APP_PASSWORD=your-16-char-password

# 5. Start backend server
npm run dev
```

✅ **Success!** You should see:
```
✅ Database connection established successfully.
🚀 Server is running!
📍 URL: http://localhost:5500
```

Keep this terminal window open!

---

## Step 3: Frontend Setup (2 minutes)

**Open a NEW terminal window:**

```bash
# 1. Navigate to frontend folder
cd frontend-next

# 2. Install dependencies
npm install

# 3. Start frontend server
npm run dev
```

✅ **Success!** You should see:
```
- Local:   http://localhost:3000
```

---

## Step 4: Open the App

1. Open browser: **http://localhost:3000**
2. You should see the LinkedIn Job Organizer dashboard!
3. Click **"Fetch New Jobs"** button in the header
4. Wait a few seconds
5. Jobs will appear in the dashboard!

---

## Verification Checklist

- [ ] Backend running on http://localhost:5500
- [ ] Frontend running on http://localhost:3000
- [ ] Dashboard loads in browser
- [ ] "Fetch New Jobs" button works
- [ ] Jobs appear after fetching

---

## 🎉 You're Done!

### Next Steps

1. **Navigate the App:**
   - 📊 **Dashboard** - View statistics
   - 💼 **All Jobs** - Browse and filter jobs
   - ⚙️ **Settings** - Read about features

2. **Try Features:**
   - ⭐ Mark jobs as favorite
   - ✓ Mark jobs as applied
   - 🔍 Search for specific jobs
   - 🗑️ Delete unwanted jobs

3. **Keep Organized:**
   - Fetch new jobs regularly
   - Track your applications
   - Use filters to focus on what matters

---

## Common Issues

### ❌ "Cannot connect to Gmail"
- Check Gmail credentials in `backend/.env`
- Verify 2-Step Verification is enabled
- Try regenerating App Password

### ❌ "No jobs found"
- Make sure you have LinkedIn job alert emails
- Check emails are from `jobalerts-noreply@linkedin.com`
- Try marking some emails as unread

### ❌ "Port 5500 already in use"
- Change `PORT=5001` in `backend/.env`
- Restart backend server

### ❌ Frontend shows connection error
- Make sure backend is running
- Check backend URL is http://localhost:5500
- Look for errors in backend terminal

---

## 📖 More Documentation

- **Backend Details:** [`plans/architecture/backend.md`](plans/architecture/backend.md)
- **Frontend Details:** [`plans/architecture/frontend.md`](plans/architecture/frontend.md)
- **Gmail Setup:** [`plans/setup/gmail-setup.md`](plans/setup/gmail-setup.md)
- **Setup Checklist:** [`plans/setup/checklist.md`](plans/setup/checklist.md)
- **Backend Testing:** `backend/TESTING.md`
- **Architecture:** `backend/ARCHITECTURE.md`
- **All Docs:** [`plans/README.md`](plans/README.md)

---

## 🆘 Need Help?

1. Check the documentation files above
2. Review error messages in terminal
3. Check browser console (F12) for frontend errors
4. Verify Gmail App Password is correct

---

## 🎯 Daily Workflow

1. Start both servers (backend + frontend)
2. Click "Fetch New Jobs" to sync latest emails
3. Browse jobs, mark favorites
4. Mark jobs as applied when you apply
5. Delete jobs you're not interested in
6. Use search and filters to organize

---

**Enjoy your organized job search!** 🚀
