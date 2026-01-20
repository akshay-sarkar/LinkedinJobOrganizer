# Backend - LinkedIn Job Organizer API

## Folder Structure

```
backend/
├── config/          # Configuration files (database, email, etc.)
├── controllers/     # Route controllers (business logic)
├── models/          # Sequelize models (database schemas)
├── routes/          # API route definitions
├── services/        # Business logic (email fetching, parsing)
├── database/        # SQLite database files (gitignored)
├── utils/           # Helper functions
├── .env.example     # Environment variables template
├── .eslintrc.json   # ESLint configuration
├── .prettierrc      # Prettier configuration
├── package.json     # Dependencies and scripts
└── server.js        # Entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure your Gmail credentials in `.env`

4. Run development server:
```bash
npm run dev
```

## API Endpoints (To be implemented)

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/fetch` - Fetch new jobs from email
- `PUT /api/jobs/:id` - Update job (mark as favorite, etc.)
- `DELETE /api/jobs/:id` - Delete job
