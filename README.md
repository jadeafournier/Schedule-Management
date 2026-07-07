# Schedule Management Program

A React + Node.js + MySQL application for tracking daily schedules. The first feature is a **sleep timer** that records sleep sessions and displays them in an analysis chart.

## Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MySQL

## Features

- **Start / Stop sleep timer** — Start when you go to sleep; the button switches to Stop. Stop when you wake up to save the session.
- **Persistent storage** — Sleep records are saved to MySQL.
- **Analysis chart** — A bar chart shows recent sleep durations in hours.

## Prerequisites

- Node.js 18+
- MySQL 8+ running locally, or a remote MySQL instance

## Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Configure the server environment:

```bash
copy server\.env.example server\.env
```

Edit `server/.env` if your MySQL settings differ:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=schedule_management
PORT=5000
```

The server creates the database and `sleep_records` table automatically on startup.

4. Run the app:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

## Build Windows executable

Package the app into a standalone `.exe` that serves the UI and API together:

```bash
npm run build:exe
```

Output goes to the `release/` folder:

| File | Purpose |
|------|---------|
| `ScheduleManagement.exe` | Double-click to run the app (includes Node.js and server) |
| `.env.example` | Copy to `.env` and set MySQL credentials |

**Before running the executable:**

1. Start MySQL (e.g. XAMPP).
2. In the `release/` folder, copy `.env.example` to `.env` and edit if needed.
3. Run `ScheduleManagement.exe` — it opens http://localhost:5000 in your browser.

MySQL is still required; the executable bundles Node.js and the server, not the database.

The build uses [caxa](https://github.com/leafac/caxa) to produce a self-contained `.exe` on Windows.

## Project Structure

```
Schedule Management/
├── client/          # React frontend
├── server/          # Express API + MySQL
└── package.json     # Root scripts to run both apps
```

## API

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/sleep-records`  | List recent sleep records |
| POST   | `/api/sleep-records`  | Save a sleep session     |
