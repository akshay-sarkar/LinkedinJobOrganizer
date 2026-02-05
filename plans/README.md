# Plans — Project Documentation Index

Central hub for all project documentation. Only `README.md` and `QUICK_START.md` live at the repo root; everything else lives here.

---

## Architecture

- [Backend Architecture](architecture/backend.md) — Express API, Sequelize ORM, Gmail IMAP integration, REST endpoints
- [Frontend Architecture](architecture/frontend.md) — Next.js 14 App Router, Tailwind CSS, component structure, data flow

## Setup Guides

- [Setup Checklist](setup/checklist.md) — Step-by-step installation and verification
- [Gmail App Password Setup](setup/gmail-setup.md) — Enable 2-Step Verification, generate app password, configure `.env`

## Changelog

1. [Initial Build](changelog/01-initial-build.md) — Full-stack app from scratch (backend + frontend)
2. [New Features](changelog/02-new-features.md) — Dark mode, sorting, date range filter, CSV export
3. [Next.js Migration](changelog/03-nextjs-migration.md) — Vite/React Router to Next.js 14 App Router
4. [Performance Optimizations](changelog/04-performance-optimizations.md) — Debouncing, memoization, virtualization, Strict Mode fix

## PRDs

- [prd.json](prds/prd.json) — Main product requirements document
- [Fix Search Input Focus](prds/fix-search-input-focus.md) — PRD for the search input focus-loss bug fix

## Roadmap

- [Roadmap](roadmap.md) — Planned features, known issues, and backlog ideas
