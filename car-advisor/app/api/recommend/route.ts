import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { UserPreferencesSchema, RecommendResponseSchema } from '@/lib/schemas'
import { buildRecommendationPrompt } from '@/lib/prompts'
import cars from '@/data/cars.json'
import { CarSpec } from '@/lib/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const preferences = UserPreferencesSchema.parse(body)

    // Pre-filter to cars within budget (max + 10% buffer) so Claude cannot pick out-of-budget cars
    const budgetCeiling = preferences.budget_max * 1.1
    const eligibleCars = (cars as CarSpec[]).filter(
      (c) => c.price_lakh * 100000 <= budgetCeiling
    )

    if (eligibleCars.length < 3) {
      return NextResponse.json(
        { error: 'Not enough cars match your budget. Try a higher range.' },
        { status: 400 }
      )
    }

    const prompt = buildRecommendationPrompt(preferences, eligibleCars)

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

    // Enrich key_specs from the dataset (never trust AI for specs)
    const enriched = {
      ...validated,
      recommendations: validated.recommendations.map((rec) => {
        const carData = (cars as CarSpec[]).find((c) => c.id === rec.car_id)
        if (!carData) throw new Error(`Car ID not found in dataset: ${rec.car_id}`)
        return {
          ...rec,
          key_specs: {
            price_lakh: carData.price_lakh,
            mileage_kmpl: carData.mileage_kmpl,
            safety_stars: carData.safety_stars,
            fuel_type: carData.fuel_type,
          },
        }
      }),
    }

    const sessionId = crypto.randomUUID()
    return NextResponse.json({ ...enriched, session_id: sessionId })
  } catch (error) {
    console.error('Recommend error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    )
  }
}
