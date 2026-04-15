# Car Advisor — AI-Powered Car Recommendation App

Find your perfect car in 2 minutes. Built for CarDekho Group take-home assignment.

## What it does

1. **4-step wizard** — captures budget, use case, fuel preference, and top priority
2. **AI recommendation engine** — uses Claude to pick exactly 3 cars from a curated 22-car dataset
3. **Personalised reasoning** — each card explains *why* this car for *you*
4. **Follow-up chat** — ask questions about the shortlist via streaming AI chat

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Anthropic Claude API (`claude-sonnet-4-5`)
- **Validation:** Zod
- **Data:** Static JSON (`/data/cars.json` — 80+ cars, 2024 specs)
- **Deployment:** Vercel

## Getting Started

```bash
# 1. Clone and install
npm install

# 2. Set your Anthropic API key
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
app/
  page.tsx              # Landing page
  onboarding/page.tsx   # 4-step wizard
  results/page.tsx      # Shortlist + follow-up chat
  api/
    recommend/route.ts  # POST — AI car recommendation
    chat/route.ts       # POST — Streaming follow-up chat
    cars/route.ts       # GET — Full car dataset

components/
  wizard/               # BudgetStep, UseCaseStep, FuelStep, PriorityStep, WizardShell
  results/              # CarCard, ShortlistGrid, FollowUpChat

lib/
  types.ts              # TypeScript interfaces
  schemas.ts            # Zod validation schemas
  prompts.ts            # AI prompt builders

data/
  cars.json             # 22 Indian cars with 2024 specs
```

## Design Decisions

- **Specs come from the dataset only** — AI never invents specs; `car_id` is validated against `cars.json`
- **Exactly 3 cars** — error state + retry if the count is wrong
- **Streaming chat** — follow-up chat uses readable stream for real-time feel
- **Session storage** — no database; state lives in `sessionStorage` (intentional MVP scope)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Add `ANTHROPIC_API_KEY` in Vercel environment variables, then deploy.
