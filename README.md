# NJOOBA

> **Building Africa's largest developer community** - One story, one line of code at a time.

A pan-African platform connecting developers, founders, and innovators across the continent. From Lagos to Nairobi, Dakar to Cairo - if you're building the future of Africa, you belong here.

---

## 🌍 What is NJOOBA?

NJOOBA is where African tech happens. We're not just another dev community - we're the beating heart of pan-African innovation.

**Track your impact.** Earn achievements. Connect with builders solving real problems across 54 countries. Whether you're shipping your first side project or scaling a startup that's changing lives, NJOOBA is your home.

---

## ⚡ Features

- **Real-time Feed** - Curated content from 94+ African data sources
- **Gamification** - Streaks, achievements, and levels that actually matter
- **Pan-African Network** - Connect with developers in every corner of the continent
- **Content Aggregation** - Automated feeds from TechCabal, Disrupt Africa, Dev.to, and more
- **Mobile-First** - Built for the way Africans actually use the internet

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router, Server Components)
- TypeScript
- Tailwind CSS v3.4
- Framer Motion

**Backend:**
- Supabase (PostgreSQL + Auth + Real-time)
- n8n (Content automation)
- Row Level Security (RLS)

**Infrastructure:**
- DigitalOcean
- Cloudflare
- Vercel (deployment)

**Security:**
- HMAC-SHA256 webhook verification
- Rate limiting
- Content Security Policy (CSP)
- Input validation (Zod)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase account
- (Optional) n8n instance for content automation

### Installation

```bash
# Clone the repository
git clone https://github.com/MouhamedN96/NJOOBA.git
cd NJOOBA

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example packages/webapp/.env.local

# Edit .env.local with your credentials
# See GET_KEYS.md for setup instructions

# Run database migrations
# Import supabase/schema.sql into your Supabase project

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - you're live.

---

## 📂 Project Structure

```
NJOOBA/
├── packages/
│   ├── webapp/              # Next.js application
│   │   ├── app/            # App router pages & API routes
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities & integrations
│   │   └── hooks/         # Custom React hooks
│   └── shared/             # Shared components & design system
├── supabase/               # Database schema & RPC functions
├── n8n-workflows/          # Content automation workflows
└── public/                 # Static assets & data sources
```

---

## 🔐 Environment Variables

Create `packages/webapp/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# n8n (Optional - for content automation)
N8N_API_KEY=your_n8n_api_key
N8N_WEBHOOK_SECRET=your_webhook_secret
N8N_BOT_USER_ID=your_bot_user_id

# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for the complete list.

---

## 🎯 Roadmap

- [x] Supabase integration
- [x] Authentication system
- [x] Content aggregation (RSS feeds)
- [x] Gamification system
- [x] Security hardening
- [ ] Mobile app (React Native)
- [ ] AI-powered content recommendations
- [ ] Job board integration
- [ ] Hackathon platform
- [ ] Mentorship matching

---

## 🤝 Contributing

NJOOBA is currently in private development. Contributions are by invitation only.

---

## 📜 License

Private - All rights reserved.

---

## 🌍 Built for Africa, by Africans

From Dakar with love.

*"Sankofa" - Learn from the past to build the future.*
