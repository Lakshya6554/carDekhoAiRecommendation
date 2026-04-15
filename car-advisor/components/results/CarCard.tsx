'use client'

import { CarRecommendation } from '@/lib/types'

interface CarCardProps {
  rec: CarRecommendation
  index: number
}

const RANK_STYLES = [
  {
    bg: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-400 text-white',
    label: '#1 Pick',
  },
  {
    bg: 'from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50',
    border: 'border-slate-200 dark:border-slate-700',
    badge: 'bg-slate-400 text-white',
    label: '#2 Pick',
  },
  {
    bg: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-400 text-white',
    label: '#3 Pick',
  },
]

function MatchBadge({ score }: { score: number }) {
  const style =
    score >= 88
      ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:ring-emerald-700'
      : score >= 75
      ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:ring-amber-700'
      : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {score}% match
    </span>
  )
}

function SpecBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white dark:bg-[#21262d] rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[#1a2234] dark:text-gray-100 leading-none">{value}</p>
      </div>
    </div>
  )
}

export default function CarCard({ rec, index }: CarCardProps) {
  const rank = RANK_STYLES[index] ?? RANK_STYLES[2]

  return (
    <div
      className={`rounded-2xl border ${rank.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
      style={{ animation: `fadeSlideUp 0.45s ease-out ${index * 130}ms both` }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${rank.bg} px-5 pt-4 pb-4 border-b ${rank.border}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${rank.badge}`}>
            {rank.label}
          </span>
          <MatchBadge score={rec.match_score} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{rec.make}</p>
          <h3 className="text-2xl font-black text-[#1a2234] dark:text-white leading-tight mt-0.5">{rec.model}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{rec.variant}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#161b22] px-5 py-4 space-y-4">
        {/* Why this car */}
        <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
          <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1.5">Why this for you</p>
          <p className="text-sm text-[#1e1b4b] dark:text-indigo-100 leading-relaxed">{rec.why_this_car}</p>
        </div>

        {/* Spec grid 2×2 */}
        <div className="grid grid-cols-2 gap-2">
          <SpecBox icon="💰" label="Price" value={`₹${rec.key_specs.price_lakh}L`} />
          <SpecBox
            icon="⛽"
            label="Mileage"
            value={rec.key_specs.mileage_kmpl > 0 ? `${rec.key_specs.mileage_kmpl} km/l` : 'Electric'}
          />
          <SpecBox icon="🛡️" label="Safety" value={`${rec.key_specs.safety_stars} / 5 ★`} />
          <SpecBox icon="🔋" label="Fuel" value={rec.key_specs.fuel_type} />
        </div>

        {/* Trade-off */}
        <div className="flex gap-2.5 px-3.5 py-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-800/50">
          <span className="text-base mt-0.5 flex-shrink-0">⚠️</span>
          <div>
            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1">Trade-off</p>
            <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">{rec.trade_off}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
