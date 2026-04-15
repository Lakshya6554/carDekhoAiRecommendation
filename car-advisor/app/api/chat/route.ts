import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildFollowUpSystemPrompt } from '@/lib/prompts'
import cars from '@/data/cars.json'
import { CarSpec } from '@/lib/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, preferences, shortlisted_car_ids } = body

  const shortlistedCars = (cars as CarSpec[]).filter((c) =>
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
