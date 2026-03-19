import { format } from 'date-fns'
import { Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const CATEGORY_COLORS = {
  Prioritization: 'bg-purple-50 text-purple-700 border-purple-200',
  'Trade-off':    'bg-orange-50 text-orange-700 border-orange-200',
  Stakeholder:    'bg-green-50 text-green-700 border-green-200',
  Technical:      'bg-blue-50 text-blue-700 border-blue-200',
  Scope:          'bg-pink-50 text-pink-700 border-pink-200',
}

const SCORE_BG = {
  1: 'bg-red-50 text-red-600',
  2: 'bg-orange-50 text-orange-600',
  3: 'bg-yellow-50 text-yellow-600',
  4: 'bg-blue-50 text-blue-600',
  5: 'bg-green-50 text-green-600',
}

const RATING_CONFIG = {
  better:      { icon: '✅', label: 'Better than expected', color: 'text-green-600' },
  as_expected: { icon: '🎯', label: 'As expected',          color: 'text-blue-600'  },
  worse:       { icon: '❌', label: 'Worse than expected',  color: 'text-red-500'   },
}

function DecisionCard({ d, onSignUp }) {
  const [expanded, setExpanded] = useState(false)
  const reviewed = d.outcomes?.length > 0
  const outcome  = d.outcomes?.[0]
  const rating   = outcome ? RATING_CONFIG[outcome.outcome_rating] : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">

      {/* ── Main row ── */}
      <div className="flex items-start justify-between gap-4 p-5">

        {/* Left */}
        <div className="flex-1 min-w-0">

          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[d.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {d.category}
            </span>
            {d.sprint_label && (
              <span className="text-xs text-gray-400">{d.sprint_label}</span>
            )}
          </div>

          {/* Title */}
          <p className="font-semibold text-gray-900 text-sm leading-snug">
            {d.title}
          </p>

          {/* Outcome summary — single line, only if reviewed */}
          {reviewed && rating && (
            <p className={`text-xs mt-1.5 font-medium ${rating.color}`}>
              {rating.icon} {rating.label}
            </p>
          )}

          {!reviewed && (
            <p className="text-xs mt-1.5 text-amber-500 font-medium">
              ⏳ Review pending
            </p>
          )}
          {reviewed && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expanded ? <><ChevronUp size={12} />Hide detail</> : <><ChevronDown size={12} />See detail</>}
            </button>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {reviewed && outcome?.accuracy_score && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SCORE_BG[outcome.accuracy_score]}`}>
                {outcome.accuracy_score}/5
              </span>
            )}
            <span className="text-xs text-gray-400">
              {format(new Date(d.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Confidence {d.confidence}/5
          </span>
          
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && reviewed && outcome && (
        <div className="border-t border-gray-50 mx-5 mb-5 pt-4 space-y-3">

          {d.rationale && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Why this decision was made
              </p>
              <p className="text-sm text-gray-600">{d.rationale}</p>
            </div>
          )}

          {outcome.claude_reflection && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">
                Claude asked
              </p>
              <p className="text-sm text-blue-900">{outcome.claude_reflection}</p>
            </div>
          )}

          {outcome.actual_outcome && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                What actually happened
              </p>
              <p className="text-sm text-gray-600">{outcome.actual_outcome}</p>
            </div>
          )}

          {outcome.lessons_learned && (
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-1">
                Lesson learned
              </p>
              <p className="text-sm text-gray-700">{outcome.lessons_learned}</p>
            </div>
          )}
        </div>
      )}

      {/* ── CTA footer ── */}
      <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {reviewed ? `Reviewed at ${outcome.review_window} days` : 'Not yet reviewed'}
        </span>
        <button
          onClick={onSignUp}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Lock size={10} />
          Log your own decisions
        </button>
      </div>

    </div>
  )
}

export default function DemoDecisionList({ decisions, onSignUp }) {
  return (
    <div className="space-y-3">
      {decisions.map(d => (
        <DecisionCard key={d.id} d={d} onSignUp={onSignUp} />
      ))}
    </div>
  )
}