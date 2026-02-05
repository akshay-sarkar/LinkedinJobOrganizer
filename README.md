# LinkedIn Job Alert Organizer

A tool that reads LinkedIn job alert emails and organizes them in an easy-to-use dashboard.

## Features

- Automatically fetch LinkedIn job alerts from Gmail
- Parse and store job listings in a local database
- Filter and sort jobs by your criteria
- Clean dashboard interface to view best matches

## Tech Stack

### Backend
- Node.js + Express
- SQLite with Sequelize ORM
- node-imap for Gmail integration
- mailparser for email parsing

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- Firebase Auth
- Axios for API calls

## Project Structure

```
├── backend/          # Express API server
├── frontend-next/    # Next.js App
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Gmail account with app password enabled
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd LinkedinJobOrganizer
```

2. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Gmail credentials
```

3. Install frontend dependencies
```bash
cd ../frontend-next
npm install
```

4. Run the application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend-next
npm run dev
```

## Configuration

See `backend/.env.example` for required environment variables.

## Documentation

All project documentation lives in the [`plans/`](plans/) folder:

- **[Architecture](plans/architecture/)** — backend and frontend summaries
- **[Setup Guides](plans/setup/)** — installation checklist, Gmail app password guide
- **[Changelog](plans/changelog/)** — history of major changes
- **[PRDs](plans/prds/)** — product requirements documents
- **[Roadmap](plans/roadmap.md)** — planned features and backlog

See [`plans/README.md`](plans/README.md) for the full index.

## License

MIT
