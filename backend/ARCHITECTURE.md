# Backend Architecture

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React Frontend)                  │
│                     http://localhost:5173                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests (GET, POST, PUT, DELETE)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (server.js)                    │
│                     http://localhost:5500                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Middleware:                                                 │ │
│  │  • CORS (allow frontend access)                            │ │
│  │  • JSON parser (parse request body)                        │ │
│  │  • Request logger (log all requests)                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Route to appropriate handler
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROUTES (jobRoutes.js)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  GET    /api/jobs           → getAllJobs()                 │ │
│  │  GET    /api/jobs/stats     → getJobStats()                │ │
│  │  GET    /api/jobs/:id       → getJobById()                 │ │
│  │  POST   /api/jobs/fetch     → fetchNewJobs()  ⚡ Main      │ │
│  │  PUT    /api/jobs/:id       → updateJob()                  │ │
│  │  DELETE /api/jobs/:id       → deleteJob()                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Execute controller function
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CONTROLLERS (jobController.js)                  │
│                       Business Logic Layer                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ • Validate request data                                     │ │
│  │ • Call services (email, parser)                            │ │
│  │ • Interact with database (via models)                      │ │
│  │ • Format response                                          │ │
│  │ • Handle errors                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────┬─────────────────────────────────┬────────────────┘
               │                                 │
               │ Uses Services                   │ Uses Models
               │                                 │
               ▼                                 ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  SERVICES                    │    │  MODELS (Job.js)             │
│  ┌────────────────────────┐  │    │  ┌────────────────────────┐  │
│  │ emailService.js        │  │    │  │ Sequelize Model        │  │
│  │ • Connect to Gmail     │  │    │  │ • Define schema        │  │
│  │ • Fetch emails (IMAP)  │  │    │  │ • Validation rules     │  │
│  │ • Mark as read         │  │    │  │ • Relationships        │  │
│  │                        │  │    │  │                        │  │
│  │ parserService.js       │  │    │  │ Methods:               │  │
│  │ • Parse HTML/text      │  │    │  │ • findAll()            │  │
│  │ • Extract job data     │  │    │  │ • findByPk()           │  │
│  │ • Regex patterns       │  │    │  │ • create()             │  │
│  │ • Clean data           │  │    │  │ • update()             │  │
│  └────────────────────────┘  │    │  │ • destroy()            │  │
└──────────────────────────────┘    │  └────────────────────────┘  │
                                    └───────────────┬──────────────┘
                                                    │
                                                    │ Database queries
                                                    │
                                                    ▼
                                    ┌──────────────────────────────┐
                                    │  DATABASE (SQLite)           │
                                    │  jobs.db                     │
                                    │  ┌────────────────────────┐  │
                                    │  │ Table: jobs            │  │
                                    │  │ • id (PK)              │  │
                                    │  │ • title                │  │
                                    │  │ • company              │  │
                                    │  │ • location             │  │
                                    │  │ • jobUrl (unique)      │  │
                                    │  │ • description          │  │
                                    │  │ • isFavorite           │  │
                                    │  │ • isApplied            │  │
                                    │  │ • createdAt            │  │
                                    │  │ • updatedAt            │  │
                                    │  └────────────────────────┘  │
                                    └──────────────────────────────┘
```

## Request Flow Example

### Example: Fetching New Jobs from Email

```
1. Frontend clicks "Fetch New Jobs" button
   ↓
2. POST /api/jobs/fetch { limit: 10 }
   ↓
3. server.js receives request → routes to jobRoutes.js
   ↓
4. jobRoutes.js calls fetchNewJobs() in jobController.js
   ↓
5. jobController.fetchNewJobs():
   a. Calls emailService.fetchEmails()
      • Connects to Gmail via IMAP
      • Searches for LinkedIn job alerts
      • Downloads email content
      • Returns array of emails

   b. For each email:
      • Calls parserService.parseLinkedInEmail()
      • Extracts job data (title, company, URL, etc.)
      • Returns job objects

   c. For each job:
      • Checks if job.jobUrl already exists in database
      • If new: Job.create() → saves to SQLite
      • If duplicate: skip

   d. Returns response:
      {
        success: true,
        data: {
          emailsFetched: 5,
          jobsAdded: 12
        }
      }
   ↓
6. Frontend receives response and updates UI
```

## File Structure & Responsibility

```
backend/
├── config/
│   └── database.js          # Sequelize connection setup
│
├── models/
│   └── Job.js               # Job table schema (ORM)
│
├── controllers/
│   └── jobController.js     # Business logic, request handling
│
├── services/
│   ├── emailService.js      # Gmail IMAP operations
│   └── parserService.js     # Email parsing, data extraction
│
├── routes/
│   └── jobRoutes.js         # URL to controller mapping
│
├── utils/
│   └── helpers.js           # Utility functions
│
├── database/
│   └── jobs.db              # SQLite database file (auto-created)
│
├── .env                     # Environment variables (secrets)
├── .env.example             # Template for .env
├── server.js                # Main entry point
└── package.json             # Dependencies
```

## Key Technologies

| Technology | Purpose | MySQL Equivalent |
|------------|---------|------------------|
| **Sequelize** | ORM (Object-Relational Mapping) | Like using a library instead of raw SQL |
| `sequelize.define()` | Define table schema | `CREATE TABLE` |
| `Job.findAll()` | Get records | `SELECT * FROM jobs` |
| `Job.create()` | Insert record | `INSERT INTO jobs` |
| `Job.update()` | Update record | `UPDATE jobs SET ...` |
| `Job.destroy()` | Delete record | `DELETE FROM jobs` |
| **node-imap** | Connect to Gmail via IMAP | Email fetching protocol |
| **mailparser** | Parse email content | Converts raw email to JS objects |
| **Express** | Web framework | Handles HTTP requests/responses |
| **SQLite** | Database | Lightweight MySQL alternative |

## Design Patterns Used

1. **MVC Pattern** (Model-View-Controller)
   - Models: `Job.js`
   - Controllers: `jobController.js`
   - Routes: `jobRoutes.js`

2. **Service Layer Pattern**
   - Business logic separated into services
   - Controllers orchestrate services
   - Services handle specific tasks (email, parsing)

3. **Repository Pattern**
   - Sequelize models act as repositories
   - Abstract database operations

4. **Middleware Pattern**
   - Express middleware for CORS, logging, error handling
   - Reusable, composable functions

## Security Considerations

- ✅ Environment variables for sensitive data
- ✅ `.gitignore` prevents committing secrets
- ✅ CORS configured for specific frontend origin
- ✅ Input validation in controllers
- ✅ Unique constraint on `jobUrl` prevents duplicates
- ✅ Email marked as unread until successfully saved

## Performance Optimizations

- ✅ Database indexes on frequently queried fields (company, location)
- ✅ Pagination support (limit/offset)
- ✅ Unique constraint on jobUrl prevents duplicate processing
- ✅ Async/await for non-blocking operations
- ✅ Connection pooling (Sequelize default)

## Error Handling

- ✅ Try-catch blocks in all async functions
- ✅ Meaningful error messages
- ✅ Proper HTTP status codes (404, 500, etc.)
- ✅ Development vs production error details
