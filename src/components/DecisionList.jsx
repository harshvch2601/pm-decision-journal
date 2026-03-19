import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

function DecisionCard({ d, onReview }) {
  const [expanded, setExpanded] = useState(false)

  const completedWindows = d.outcomes?.map(o => o.review_window) || []
  const reviewsDue = [
    { days: 30, due: d.review_30_due },
    { days: 60, due: d.review_60_due },
    { days: 90, due: d.review_90_due },
  ].filter(r => r.due && new Date(r.due) <= new Date() && !completedWindows.includes(r.days))

  const latestOutcome = d.outcomes?.length > 0
    ? d.outcomes.sort((a, b) => b.review_window - a.review_window)[0]
    : null

  const rating = latestOutcome ? RATING_CONFIG[latestOutcome.outcome_rating] : null
  const isReviewed = !!latestOutcome

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
            {reviewsDue.length > 0 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {reviewsDue.length} review{reviewsDue.length > 1 ? 's' : ''} due
              </span>
            )}
          </div>

          {/* Title */}
          <p className="font-semibold text-gray-900 text-sm leading-snug">
            {d.title}
          </p>

          {/* Status line */}
          {isReviewed && rating && (
            <p className={`text-xs mt-1.5 font-medium ${rating.color}`}>
              {rating.icon} {rating.label}
            </p>
          )}

          {!isReviewed && reviewsDue.length === 0 && (
            <p className="text-xs mt-1.5 text-gray-400">
              ⏳ Awaiting first review
            </p>
          )}

          {/* Expand toggle — left aligned, under status */}
          {isReviewed && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
            >
              {expanded
                ? <><ChevronUp size={11} />Hide detail</>
                : <><ChevronDown size={11} />See outcome & lesson</>
              }
            </button>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {isReviewed && latestOutcome?.accuracy_score && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SCORE_BG[latestOutcome.accuracy_score]}`}>
                {latestOutcome.accuracy_score}/5
              </span>
            )}
            <span className="text-xs text-gray-400">
              {format(new Date(d.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Confidence {d.confidence}/5
          </span>
          {reviewsDue.length > 0 && (
            <button
              onClick={() => onReview(d, reviewsDue[0].days)}
              className="mt-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Review now →
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && latestOutcome && (
        <div className="border-t border-gray-50 mx-5 mb-5 pt-4 space-y-3">

          {d.rationale && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Why this decision was made
              </p>
              <p className="text-sm text-gray-600">{d.rationale}</p>
            </div>
          )}

          {d.expected_outcome && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Expected outcome
              </p>
              <p className="text-sm text-gray-600">{d.expected_outcome}</p>
            </div>
          )}

          {latestOutcome.claude_reflection && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">
                Claude asked
              </p>
              <p className="text-sm text-blue-900">{latestOutcome.claude_reflection}</p>
            </div>
          )}

          {latestOutcome.actual_outcome && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                What actually happened
              </p>
              <p className="text-sm text-gray-600">{latestOutcome.actual_outcome}</p>
            </div>
          )}

          {latestOutcome.lessons_learned && (
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-1">
                Lesson learned
              </p>
              <p className="text-sm text-gray-700">{latestOutcome.lessons_learned}</p>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Reviewed at {latestOutcome.review_window} days
            {d.outcomes.length > 1 && ` · ${d.outcomes.length} total reviews`}
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {isReviewed
            ? `Last reviewed at ${latestOutcome.review_window} days`
            : 'Not yet reviewed'}
        </span>
        <div className="flex items-center gap-3">
          {[30, 60, 90].map(w => {
            const done = completedWindows.includes(w)
            return (
              <span
                key={w}
                className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  done
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-50 text-gray-300'
                }`}
              >
                {w}d
              </span>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default function DecisionList({ decisions, onReview }) {
  if (decisions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">📓</p>
        <p className="font-medium text-gray-500">No decisions logged yet</p>
        <p className="text-sm mt-1">Log your first decision to start building your PM learning database</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {decisions.map(d => (
        <DecisionCard key={d.id} d={d} onReview={onReview} />
      ))}
    </div>
  )
}