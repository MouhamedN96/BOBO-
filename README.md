# NJOOBA

Pan-African developer community platform.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- n8n (Content Automation)
- pnpm workspaces

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account
- n8n instance (optional)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example packages/webapp/.env.local

# Update .env.local with your credentials

# Run development server
pnpm dev
```

## Environment Variables

See `.env.example` for required environment variables.

## Project Structure

```
├── packages/
│   ├── webapp/          # Next.js application
│   └── shared/          # Shared components
├── supabase/           # Database schema
└── n8n-workflows/      # Automation workflows
```

## License

Private
