# Backend Testing Guide

## Setup Instructions

### 1. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your credentials:
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synced
🚀 Server is running!
📍 URL: http://localhost:5500
```

---

## Testing the API

### Method 1: Using Browser

Open your browser and visit:
- http://localhost:5500 - API info
- http://localhost:5500/api/health - Health check
- http://localhost:5500/api/jobs - Get all jobs

### Method 2: Using cURL (Terminal)

#### Get all jobs
```bash
curl http://localhost:5500/api/jobs
```

#### Fetch new jobs from Gmail
```bash
curl -X POST http://localhost:5500/api/jobs/fetch \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

#### Get job statistics
```bash
curl http://localhost:5500/api/jobs/stats
```

#### Update a job (mark as favorite)
```bash
curl -X PUT http://localhost:5500/api/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{"isFavorite": true}'
```

#### Delete a job
```bash
curl -X DELETE http://localhost:5500/api/jobs/1
```

#### Search jobs
```bash
curl "http://localhost:5500/api/jobs?search=developer&limit=10"
```

#### Filter jobs by company
```bash
curl "http://localhost:5500/api/jobs?company=Google"
```

#### Get favorites only
```bash
curl "http://localhost:5500/api/jobs?isFavorite=true"
```

### Method 3: Using Postman or Thunder Client (VS Code Extension)

Import these requests:

**GET** `http://localhost:5500/api/jobs`
**POST** `http://localhost:5500/api/jobs/fetch`
Body (JSON):
```json
{
  "limit": 10
}
```

**PUT** `http://localhost:5500/api/jobs/1`
Body (JSON):
```json
{
  "isFavorite": true,
  "notes": "Interesting position!"
}
```

---

## Expected Flow

1. **Start server** → Creates database and tables automatically
2. **Call POST /api/jobs/fetch** → Fetches LinkedIn job emails from Gmail
3. **Call GET /api/jobs** → See the jobs in database
4. **Call GET /api/jobs/stats** → View statistics
5. **Call PUT /api/jobs/:id** → Update job status
6. **Call DELETE /api/jobs/:id** → Remove job

---

## Troubleshooting

### Error: "ECONNREFUSED" or "connect ETIMEDOUT"
- Check Gmail credentials in `.env`
- Ensure 2-Step Verification is enabled
- Verify App Password is correct (no spaces)
- Check internet connection

### Error: "No new LinkedIn job alerts found"
- Make sure you have LinkedIn job alert emails in your inbox
- Check they're from `jobalerts-noreply@linkedin.com`
- Try changing search criteria in `emailService.js`

### Error: "SQLITE_CANTOPEN"
- Ensure `backend/database/` folder exists
- Check file permissions

### Database not updating
- Delete `backend/database/jobs.db` and restart server
- It will recreate the database with fresh schema

---

## Development Tips

### View Database Contents

Install SQLite browser:
```bash
brew install sqlite  # macOS
```

Query database:
```bash
sqlite3 backend/database/jobs.db
.tables
SELECT * FROM jobs;
.exit
```

### Reset Database
```bash
rm backend/database/jobs.db
npm run dev
```

### Check Logs
The server logs all requests and database operations to console.

---

## Next Steps

Once backend is working:
1. Build the React frontend
2. Connect frontend to this API
3. Create the dashboard UI
4. Add more filtering options
