<p align="center">
  <h1 align="center">🧠 ManasSwasthya — Mental Health & Wellness Platform</h1>
  <p align="center">
    A full-stack AI-powered mental health platform for students, featuring assessments, mood tracking, community support, mentor sessions, and mindfulness tools.
  </p>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the App](#-running-the-app)
- [API Endpoints](#-api-endpoints)
- [Multilingual Support](#-multilingual-support)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AI Assessments** | 5-question mental health assessments analyzed by Google Gemini AI with stress, anxiety & sleep scores |
| **Mood Tracking** | Daily mood logging with notes and trend visualization |
| **AI Chat** | Conversational AI companion powered by Gemini for mental health support |
| **Community** | Discussion groups, peer support forums, and group chat rooms |
| **Mentor System** | Authenticated mentor login, 1-on-1 sessions, and mentor profiles with ratings |
| **Medicine Analyzer** | AI-powered medicine analysis with safety verdicts and dosage info |
| **Journaling** | Personal journal with mood tags and search |
| **Events** | Community events with registration, capacity tracking, and scheduling |
| **Booking** | Session booking system for mentor appointments |
| **Resources** | Curated mental health resources and educational content |
| **Multilingual** | Supports English, Hindi (हिन्दी), Kashmiri (कॉशुर), and Odia (ଓଡ଼ିଆ) |

---

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (dev server on port `8080`)
- **Tailwind CSS** with `tailwindcss-animate`
- **Radix UI** — Complete component library (Dialog, Tabs, Toast, etc.)
- **React Router DOM** — Client-side routing
- **TanStack React Query** — Server state management
- **Framer Motion** — Animations
- **Recharts** — Data visualization charts
- **React Hook Form** + **Zod** — Form validation
- **Clerk** — Authentication (sign-up, sign-in, user management)
- **i18next** — Internationalization (4 languages)
- **Lucide React** — Icons
- **shadcn/ui** — Pre-built component patterns

### Backend
- **Express.js 5** — REST API server (port `3001`)
- **Prisma ORM** — Database access with type safety
- **PostgreSQL** (Neon serverless) — Database
- **Google Generative AI** (`gemini-2.0-flash`) — AI assessments & chat
- **dotenv** — Environment variable management
- **CORS** — Cross-origin resource sharing

---

## 📁 Project Structure

```
manasswasthya/
├── .gitignore
├── README.md
└── nexus-mind-care/           # Main application
    ├── .env.example           # Environment variable template
    ├── index.html             # Entry HTML
    ├── package.json           # Dependencies & scripts
    ├── server.js              # Express backend server
    ├── vite.config.ts         # Vite configuration
    ├── tailwind.config.cjs    # Tailwind CSS configuration
    ├── tsconfig.json          # TypeScript config
    ├── prisma/
    │   └── schema.prisma      # Database schema (12 models)
    ├── locales/               # i18n translation files
    │   ├── en/                # English
    │   ├── hi/                # Hindi
    │   ├── ks/                # Kashmiri
    │   └── or/                # Odia
    ├── public/                # Static assets
    ├── src/
    │   ├── App.tsx            # Root component with routing
    │   ├── main.tsx           # Entry point
    │   ├── auth/              # Authentication components
    │   ├── components/        # 93 UI components
    │   ├── contexts/          # React contexts
    │   ├── hooks/             # Custom hooks
    │   ├── lib/               # Utility libraries
    │   ├── pages/             # 11 page components
    │   ├── types/             # TypeScript type definitions
    │   └── utils/             # Utility functions
    └── scripts/               # Helper scripts
```

---

## 📦 Prerequisites

Make sure you have the following installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |
| **Git** | Latest | `git --version` |

You will also need accounts for:
- [**Clerk**](https://clerk.com) — Authentication (free tier available)
- [**Google AI Studio**](https://aistudio.google.com) — Gemini API key (free tier available)
- [**Neon**](https://neon.tech) — PostgreSQL database (free tier available)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aniket-311211/manasswasthya.git
cd manasswasthya/nexus-mind-care
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Now edit the `.env` file with your actual credentials (see [Environment Variables](#-environment-variables) section below).

### 4. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

### 5. Start the Application

You need **two terminals** — one for the frontend, one for the backend:

**Terminal 1 — Backend API Server:**
```bash
npm run server
```
> Backend starts at `http://localhost:3001`

**Terminal 2 — Frontend Dev Server:**
```bash
npm run dev
```
> Frontend starts at `http://localhost:8080`

### 6. Open in Browser

Navigate to **http://localhost:8080** and sign up using Clerk authentication.

---

## 🔐 Environment Variables

Create a `.env` file in the `nexus-mind-care/` directory. Use `.env.example` as a reference.

### Required Variables

| Variable | Service | How to Get |
|----------|---------|------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `VITE_GEMINI_API_KEY` | Google AI | [AI Studio](https://aistudio.google.com/apikey) → Create API Key |
| `VITE_GEMINI_FALLBACK_API_KEY` | Google AI | Same as above (can use same key) |
| `GEMINI_API_KEY` | Google AI | Same key as above (used by backend) |
| `DATABASE_URL` | Neon | [Neon Console](https://console.neon.tech) → Connection Details |

### Database Variables (from Neon Dashboard)

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
PGHOST=your-neon-host.neon.tech
PGUSER=your_username
PGDATABASE=neondb
PGPASSWORD=your_password
```

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend server port |
| `NEXT_PUBLIC_STACK_PROJECT_ID` | — | Neon Auth (if using) |
| `STACK_SECRET_SERVER_KEY` | — | Neon Auth server key |

---

## 🗄 Database Setup

This project uses **PostgreSQL** via **Neon** (serverless) with **Prisma ORM**.

### Database Models (12 total)

| Model | Purpose |
|-------|---------|
| `User` | User profiles linked to Clerk auth |
| `Assessment` | AI-generated mental health assessment results |
| `UserActivity` | Activity tracking and completion |
| `ChatMessage` | Messages in AI chats and community rooms |
| `ChatRoom` | Group chats, mentor sessions, private DMs |
| `Mentor` | Authenticated mentor profiles with ratings |
| `MoodEntry` | Daily mood tracking with stress/anxiety/sleep |
| `MindfulnessGame` | Mindfulness game tracking |
| `MedicineAnalysis` | AI medicine analysis history |
| `JournalEntry` | Personal journal entries |
| `Event` | Community events |
| `EventRegistration` | Event registration tracking |

### Useful Prisma Commands

```bash
# View your data in browser
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset

# Generate client after schema changes
npx prisma generate
```

---

## 🔌 API Endpoints

The backend server runs on `http://localhost:3001`.

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create/update user |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessments` | Save assessment results |
| GET | `/api/assessments/user/:clerkId` | Get user's assessment history |
| POST | `/api/analyze` | AI analysis via Gemini |

### Mood
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mood` | Log a mood entry |
| GET | `/api/mood/user/:clerkId` | Get mood history |

### Chat & Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/rooms` | List chat rooms |
| POST | `/api/chat/rooms` | Create a chat room |
| GET | `/api/chat/rooms/:roomId/messages` | Get room messages |
| POST | `/api/chat/rooms/:roomId/messages` | Send a message |
| GET | `/api/community/groups` | List community groups |
| POST | `/api/community/groups/:groupId/join` | Join a group |

### Mentors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mentors/login` | Mentor authentication |
| POST | `/api/mentors/logout` | Mentor logout |
| GET | `/api/mentors` | List all mentors |

### Medicine
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/medicine/save` | Save medicine analysis |
| GET | `/api/medicine/history/:clerkId` | Get analysis history |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| POST | `/api/events/:eventId/register` | Register for event |
| DELETE | `/api/events/:eventId/register` | Unregister from event |

---

## 🌐 Multilingual Support

The app supports 4 languages via **i18next**:

| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `hi` | Hindi | Devanagari (हिन्दी) |
| `ks` | Kashmiri | Devanagari (कॉशुर) |
| `or` | Odia | Odia (ଓଡ଼ିଆ) |

Translation files are in `locales/{lang}/translation.json`.

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>❌ "Cannot connect to database"</strong></summary>

- Verify your `DATABASE_URL` in `.env` is correct
- Ensure Neon project is active (free tier pauses after inactivity)
- Check that `?sslmode=require` is included in the URL
- Run `npx prisma db push` to sync schema
</details>

<details>
<summary><strong>❌ "Clerk authentication not working"</strong></summary>

- Verify `VITE_CLERK_PUBLISHABLE_KEY` starts with `pk_test_` or `pk_live_`
- Ensure the key is from the correct Clerk application
- Check Clerk dashboard for allowed origins (add `http://localhost:8080`)
</details>

<details>
<summary><strong>❌ "Gemini AI analysis failed"</strong></summary>

- Verify your `GEMINI_API_KEY` is valid at [AI Studio](https://aistudio.google.com)
- Check API quota limits (free tier: 60 requests/minute)
- Ensure both `VITE_GEMINI_API_KEY` (frontend) and `GEMINI_API_KEY` (backend) are set
</details>

<details>
<summary><strong>❌ "CORS errors in browser"</strong></summary>

- Make sure the backend is running on port `3001`
- Both servers must be running simultaneously
- Check that `cors()` middleware is enabled in `server.js`
</details>

<details>
<summary><strong>❌ "Prisma client not generated"</strong></summary>

```bash
npx prisma generate
```
Run this after every `npm install` or schema change.
</details>

---

## 📜 Available Scripts

Run these from the `nexus-mind-care/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server (port 8080) |
| `npm run server` | Start backend API server (port 3001) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ for mental health awareness
</p>
