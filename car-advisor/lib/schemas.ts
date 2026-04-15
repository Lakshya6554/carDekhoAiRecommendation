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
