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
