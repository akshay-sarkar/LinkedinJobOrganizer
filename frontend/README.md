# Frontend - LinkedIn Job Organizer Dashboard

## Folder Structure (Feature-based)

```
frontend/
├── src/
│   ├── components/      # Shared/reusable components
│   │   ├── common/      # Buttons, inputs, cards, etc.
│   │   └── layout/      # Header, footer, sidebar
│   ├── features/        # Feature-specific modules
│   │   ├── jobs/        # Job listing, job card, filters
│   │   ├── dashboard/   # Dashboard stats, charts
│   │   └── settings/    # User preferences, email config
│   ├── pages/           # Page components (routes)
│   ├── services/        # API calls (axios instances)
│   ├── styles/          # Global CSS, Tailwind config
│   ├── utils/           # Helper functions
│   ├── assets/          # Images, icons
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Tailwind CSS

This project uses Tailwind CSS for styling. Learn more at: https://tailwindcss.com/docs
