# Claude Code — Build Prompt
## Car Advisor · CarDekho AI Assignment

## CONTEXT

You are helping me build a full-stack AI-powered car recommendation app called **Car Advisor** for a take-home assignment from CarDekho Group. I have a 2–3 hour build window. The app must be deployed and working end-to-end by the end of the session.

**Assignment brief summary:** Build something that helps a car buyer go from "I don't know what to buy" to a confident shortlist of 2–3 cars. Full-stack, deployed, real AI, working in under 2 minutes to run.

---

## WHAT WE ARE BUILDING

A Next.js 14 app with:
1. A 4-step chat-style onboarding wizard (budget, use-case, fuel, priority)
2. An AI recommendation engine using Claude API that returns exactly 3 cars with personalised reasoning
3. A result cards view showing the shortlist
4. A follow-up chat below the cards for refinement questions

**What we are NOT building (do not add these):**
- User authentication or accounts
- A database (use static JSON)
- Image galleries
- EMI calculators
- Live price APIs
- Comparison tables (Phase 2)

---

## TECH STACK — DO NOT DEVIATE

```
Framework:    Next.js 14 with App Router
Language:     TypeScript (strict mode)
Styling:      Tailwind CSS + shadcn/ui
AI:           Anthropic Claude API via Vercel AI SDK (useChat, streamText)
Model:        claude-sonnet-4-5
Validation:   Zod
Data:         Static JSON file at /data/cars.json
Deployment:   Vercel
```

---

## STEP 1 — PROJECT SCAFFOLD

Run these commands to initialise the project:

```bash
npx create-next-app@latest car-advisor \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd car-advisor

# Install dependencies
npm install ai @anthropic-ai/sdk zod
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge progress input textarea

# Create folder structure
mkdir -p app/onboarding app/results app/api/recommend app/api/chat app/api/cars
mkdir -p components/wizard components/results components/ui
mkdir -p lib data
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `.env.example`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## STEP 2 — TYPES AND SCHEMAS

Create `lib/types.ts`:

```typescript
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'electric' | 'any'
export type UseCase = 'city' | 'highway' | 'mixed'
export type Priority = 'mileage' | 'safety' | 'comfort' | 'performance' | 'value'

export interface UserPreferences {
  budget_min: number
  budget_max: number
  use_case: UseCase
  fuel_preference: FuelType
  top_priority: Priority
  family_size: 2 | 4 | 5 | 7
}

export interface CarSpec {
  id: string
  make: string
  model: string
  variant: string
  year: number
  price_lakh: number
  fuel_type: string
  transmission: string
  mileage_kmpl: number
  engine_cc: number
  safety_stars: number
  seating: number
  boot_space_litres: number
  body_type: string
  ideal_for: string[]
  user_review_summary: string
  pros: string[]
  cons: string[]
}

export interface CarRecommendation {
  car_id: string
  make: string
  model: string
  variant: string
  match_score: number
  why_this_car: string
  key_specs: {
    price_lakh: number
    mileage_kmpl: number
    safety_stars: number
    fuel_type: string
  }
  trade_off: string
}

export interface RecommendResponse {
  recommendations: CarRecommendation[]
  session_id: string
}
```

Create `lib/schemas.ts`:

```typescript
import { z } from 'zod'

export const UserPreferencesSchema = z.object({
  budget_min: z.number().min(100000),
  budget_max: z.number().min(100000),
  use_case: z.enum(['city', 'highway', 'mixed']),
  fuel_preference: z.enum(['petrol', 'diesel', 'cng', 'electric', 'any']),
  top_priority: z.enum(['mileage', 'safety', 'comfort', 'performance', 'value']),
  family_size: z.union([z.literal(2), z.literal(4), z.literal(5), z.literal(7)]),
})

export const CarRecommendationSchema = z.object({
  car_id: z.string(),
  make: z.string(),
  model: z.string(),
  variant: z.string(),
  match_score: z.number().min(0).max(100),
  why_this_car: z.string(),
  key_specs: z.object({
    price_lakh: z.number(),
    mileage_kmpl: z.number(),
    safety_stars: z.number(),
    fuel_type: z.string(),
  }),
  trade_off: z.string(),
})

export const RecommendResponseSchema = z.object({
  recommendations: z.array(CarRecommendationSchema).length(3),
})
```

---

## STEP 3 — CAR DATASET

Create `data/cars.json` with at least 20 cars covering these segments:
- Hatchbacks: Maruti Swift, Hyundai i20, Tata Altroz, Maruti Baleno
- Compact SUVs: Tata Nexon, Hyundai Venue, Kia Sonet, Maruti Brezza
- Sedans: Honda City, Maruti Ciaz, Hyundai Verna
- Mid SUVs: Hyundai Creta, Kia Seltos, MG Astor, Skoda Kushaq
- Electric: Tata Tiago EV, Tata Nexon EV, MG ZS EV
- Budget: Maruti Alto K10, Renault Kwid, Tata Punch

Each entry must follow the CarSpec interface exactly. Use realistic 2024 specs.

Example entry:
```json
{
  "id": "maruti-swift-vxi-2024",
  "make": "Maruti Suzuki",
  "model": "Swift",
  "variant": "VXi",
  "year": 2024,
  "price_lakh": 7.19,
  "fuel_type": "Petrol",
  "transmission": "Manual",
  "mileage_kmpl": 23.2,
  "engine_cc": 1197,
  "safety_stars": 3,
  "seating": 5,
  "boot_space_litres": 268,
  "body_type": "Hatchback",
  "ideal_for": ["city", "first_car", "budget"],
  "user_review_summary": "Reliable daily driver, extremely low running cost",
  "pros": ["Best-in-class mileage", "Low service cost", "Easy to park"],
  "cons": ["Basic safety features", "Small boot", "Firm ride on bad roads"]
}
```

---

## STEP 4 — AI PROMPT

Create `lib/prompts.ts`:

```typescript
import { CarSpec, UserPreferences } from './types'

export function buildRecommendationPrompt(
  preferences: UserPreferences,
  cars: CarSpec[]
): string {
  return `You are an expert car advisor for Indian buyers. Your job is to recommend exactly 3 cars from the provided dataset that best match the user's preferences.

CRITICAL RULES:
1. Recommend EXACTLY 3 cars — no more, no less
2. Never recommend a car more than 15% over the stated max budget
3. Base match_score on how well the car fits the user's top_priority (not just overall specs)
4. why_this_car must be personalised — reference the user's specific use case and priority
5. trade_off must be honest — name a real limitation for THIS user, not generic cons
6. Spread fuel types where possible unless user specified a strong preference
7. NEVER invent specs — use ONLY the data provided in the DATASET section

USER PREFERENCES:
- Budget: ₹${(preferences.budget_min / 100000).toFixed(1)}L – ₹${(preferences.budget_max / 100000).toFixed(1)}L
- Primary use: ${preferences.use_case}
- Fuel preference: ${preferences.fuel_preference}
- Top priority: ${preferences.top_priority}
- Family size: ${preferences.family_size} people

DATASET:
${JSON.stringify(cars, null, 2)}

Respond with a JSON object matching exactly this structure:
{
  "recommendations": [
    {
      "car_id": "string — must match an id from the dataset",
      "make": "string",
      "model": "string", 
      "variant": "string",
      "match_score": number (0-100),
      "why_this_car": "2 sentences, personalised to this user's priorities",
      "key_specs": {
        "price_lakh": number,
        "mileage_kmpl": number,
        "safety_stars": number,
        "fuel_type": "string"
      },
      "trade_off": "1 sentence — honest limitation for this specific user"
    }
  ]
}

Return ONLY the JSON object. No explanation, no markdown, no preamble.`
}

export function buildFollowUpSystemPrompt(
  preferences: UserPreferences,
  shortlistedCars: CarSpec[]
): string {
  return `You are a helpful car advisor. You previously recommended 3 cars to this user based on their preferences. Answer their follow-up questions helpfully and honestly.

USER'S ORIGINAL PREFERENCES:
- Budget: ₹${(preferences.budget_min / 100000).toFixed(1)}L – ₹${(preferences.budget_max / 100000).toFixed(1)}L
- Primary use: ${preferences.use_case}
- Fuel preference: ${preferences.fuel_preference}
- Top priority: ${preferences.top_priority}
- Family size: ${preferences.family_size} people

SHORTLISTED CARS (full specs):
${JSON.stringify(shortlistedCars, null, 2)}

Be conversational but specific. When comparing cars, always relate back to this user's stated priorities. If asked about a car not in the shortlist, explain why it wasn't recommended based on the user's preferences.`
}
```

---

## STEP 5 — API ROUTES

Create `app/api/recommend/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { UserPreferencesSchema, RecommendResponseSchema } from '@/lib/schemas'
import { buildRecommendationPrompt } from '@/lib/prompts'
import cars from '@/data/cars.json'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const preferences = UserPreferencesSchema.parse(body)

    const prompt = buildRecommendationPrompt(preferences, cars)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    // Strip any markdown fences just in case
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const validated = RecommendResponseSchema.parse(parsed)

    const sessionId = crypto.randomUUID()
    return NextResponse.json({ ...validated, session_id: sessionId })
  } catch (error) {
    console.error('Recommend error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    )
  }
}
```

Create `app/api/chat/route.ts`:

```typescript
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildFollowUpSystemPrompt } from '@/lib/prompts'
import cars from '@/data/cars.json'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, preferences, shortlisted_car_ids } = body

  const shortlistedCars = cars.filter((c: any) =>
    shortlisted_car_ids.includes(c.id)
  )

  const systemPrompt = buildFollowUpSystemPrompt(preferences, shortlistedCars)

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: systemPrompt,
    messages: messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

Create `app/api/cars/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import cars from '@/data/cars.json'

export async function GET() {
  return NextResponse.json(cars)
}
```

---

## STEP 6 — WIZARD COMPONENTS

Create `components/wizard/WizardShell.tsx` — a multi-step container with:
- Progress bar at top (shows step N of 4)
- Animated step transitions (slide in from right)
- Back button (disabled on step 1)
- Each step renders as a card with a question + options

Create these step components with large tap-friendly option buttons (not dropdowns):

**`components/wizard/BudgetStep.tsx`** — budget range selection:
- Options: Under ₹5L / ₹5–8L / ₹8–12L / ₹12–18L / ₹18–25L / Above ₹25L
- Maps to `{ budget_min, budget_max }` in rupees

**`components/wizard/UseCaseStep.tsx`** — primary use:
- City driving / Highway trips / Mixed use
- Include a short description under each option

**`components/wizard/FuelStep.tsx`** — fuel preference:
- Petrol / Diesel / CNG / Electric / No preference
- Include running cost hint (₹/km approx)

**`components/wizard/PriorityStep.tsx`** — what matters most:
- Mileage / Safety / Comfort / Performance / Value for money
- Each with an icon and 1-line description

---

## STEP 7 — RESULT COMPONENTS

Create `components/results/CarCard.tsx`:
- Car name + variant as heading
- Match score as a colored badge (90+ = green, 75–89 = amber, below = gray)
- "Why this for you" blurb in a highlighted box
- 4 spec pills: price, mileage, safety stars, fuel
- Trade-off in a subtle warning-toned box at the bottom
- Subtle entrance animation (fade + slide up, staggered by index)

Create `components/results/ShortlistGrid.tsx`:
- 3 cards in a responsive grid (1 col mobile, 3 col desktop)
- Loading state: 3 skeleton cards while AI processes

Create `components/results/FollowUpChat.tsx`:
- Scrollable message list above a sticky input
- User messages right-aligned, AI messages left-aligned
- Typing indicator (3 animated dots) while streaming
- Sends to `/api/chat` with full message history + preferences context

---

## STEP 8 — PAGES

**`app/page.tsx`** — Landing:
- Full-viewport hero
- Headline: "Find your perfect car in 2 minutes"
- Sub: "Tell us what matters. We'll cut through 300 options and show you exactly 3."
- Single CTA button → `/onboarding`
- Clean, confident design — no car images needed

**`app/onboarding/page.tsx`**:
- Renders `WizardShell` with all 4 steps
- On completion: POST to `/api/recommend`, show loading state, navigate to `/results` with recommendations in query params or sessionStorage

**`app/results/page.tsx`**:
- Read preferences + recommendations from sessionStorage
- Render `ShortlistGrid`
- Render `FollowUpChat` below
- "Start over" button → clears storage, back to `/`

---

## STEP 9 — STYLING NOTES

- Use a warm off-white background (`#FAFAF8`) not pure white
- Primary accent: a confident dark color (navy or charcoal), not the usual blue
- Cards should have subtle borders and gentle shadows
- Match score badge colors: green for 88+, amber for 75–87, slate for below
- The "why this car" blurb should stand out visually — light tinted background
- Mobile-first: test at 375px width, all tap targets minimum 44px

---

## STEP 10 — FINAL CHECKLIST BEFORE SUBMISSION

Run through this before ending the session:

- [ ] `npm run dev` starts cleanly with no errors
- [ ] `npm run build` completes without TypeScript errors
- [ ] Wizard completes all 4 steps and submits
- [ ] AI returns 3 real recommendations (not mocked)
- [ ] Each card shows personalised reasoning (not generic)
- [ ] Follow-up chat sends and receives a streamed response
- [ ] "Start over" clears state and returns to landing
- [ ] Works on mobile viewport (375px)
- [ ] Deployed to Vercel — live URL works
- [ ] `.env.example` committed (never `.env.local`)
- [ ] README.md written and committed

---

## IMPORTANT CONSTRAINTS

1. **Specs never come from AI.** The `key_specs` in each recommendation must be taken from the dataset JSON — not from Claude's response. Validate that `car_id` in the response matches an actual entry in `cars.json`, then pull specs from there.

2. **Always show exactly 3 cards.** If Claude returns fewer or more, show an error state and allow retry. Never show a broken partial result.

3. **Error states are required.** API failures must show a user-facing message with a retry button — not a broken blank screen.

4. **Streaming for follow-up.** The follow-up chat must stream — a full response appearing at once feels wrong in a chat context.

5. **Do not add a database.** Session state lives in `sessionStorage`. This is intentional for the MVP.

---

## SESSION MANAGEMENT PATTERN

```typescript
// After getting recommendations, store in sessionStorage:
sessionStorage.setItem('preferences', JSON.stringify(preferences))
sessionStorage.setItem('recommendations', JSON.stringify(recommendations))
sessionStorage.setItem('session_id', sessionId)

// On results page load:
const preferences = JSON.parse(sessionStorage.getItem('preferences') ?? '{}')
const recommendations = JSON.parse(sessionStorage.getItem('recommendations') ?? '[]')

// On start over:
sessionStorage.clear()
router.push('/')
```

---

## START HERE

Begin with Step 1 (scaffold + install). Confirm the dev server runs before moving to Step 2. Work through each step in order — don't jump ahead. At the end of Step 5 (API routes), the core flow should work end-to-end even if the UI is rough. Polish the UI in Steps 6–8.

Good luck. Ship it.
