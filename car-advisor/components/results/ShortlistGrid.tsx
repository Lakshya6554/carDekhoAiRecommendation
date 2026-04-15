'use client'

import { CarRecommendation } from '@/lib/types'
import CarCard from './CarCard'

interface ShortlistGridProps {
  recommendations: CarRecommendation[]
  isLoading: boolean
  error?: string
  onRetry?: () => void
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-pulse">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-7 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3.5 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="h-20 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
        <div className="h-14 bg-amber-50 dark:bg-amber-950/20 rounded-xl" />
      </div>
    </div>
  )
}

export default function ShortlistGrid({ recommendations, isLoading, error, onRetry }: ShortlistGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center text-2xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-[#1a2234] dark:text-white mb-2">Something went wrong</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-sm">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="px-6 py-3 bg-[#1a2234] dark:bg-indigo-600 text-white rounded-xl font-semibold hover:bg-[#2a3549] dark:hover:bg-indigo-700 transition-colors text-sm">
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <div className="text-center mb-6">
          <p className="text-[#1a2234] dark:text-white font-semibold">Analysing 80 cars for you...</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Our AI is reading specs, mileage, and reviews</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (recommendations.length !== 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl mb-4">🔄</div>
        <h3 className="text-lg font-semibold text-[#1a2234] dark:text-white mb-2">Unexpected result</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">We didn&apos;t get exactly 3 recommendations. Please try again.</p>
        {onRetry && (
          <button onClick={onRetry} className="px-6 py-3 bg-[#1a2234] dark:bg-indigo-600 text-white rounded-xl font-semibold hover:bg-[#2a3549] dark:hover:bg-indigo-700 transition-colors text-sm">
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recommendations.map((rec, index) => (
        <CarCard key={rec.car_id} rec={rec} index={index} />
      ))}
    </div>
  )
}
