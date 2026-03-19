import { format } from 'date-fns'
import { Lock } from 'lucide-react'

const CATEGORY_COLORS = {
  Prioritization: 'bg-purple-50 text-purple-700',
  'Trade-off': 'bg-orange-50 text-orange-700',
  Stakeholder: 'bg-green-50 text-green-700',
  Technical: 'bg-blue-50 text-blue-700',
  Scope: 'bg-pink-50 text-pink-700',
}

const SCORE_COLORS = {
  1: 'text-red-600', 2: 'text-orange-500',
  3: 'text-yellow-600', 4: 'text-blue-600', 5: 'text-green-600'
}

const RATING_LABELS = {
  better: '✅ Better than expected',
  as_expected: '🎯 As expected',
  worse: '❌ Worse than expected'
}

export default function DemoDecisionList({ decisions, onSignUp }) {
  return (
    <div className="space-y-3">
      {decisions.map(d => {
        const reviewed = d.outcomes?.length > 0
        const outcome = d.outcomes?.[0]

        return (
          <div key={d.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[d.category] || 'bg-gray-100 text-gray-600'}`}>
                    {d.category}
                  </span>
                  {d.sprint_label && <span className="text-xs text-gray-400">{d.sprint_label}</span>}
                  {reviewed && (
                    <span className={`text-xs font-semibold ${SCORE_COLORS[outcome.accuracy_score]}`}>
                      {outcome.accuracy_score}/5 accuracy
                    </span>
                  )}
                  {!reviewed && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                      Review pending
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                {d.rationale && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">Why: {d.rationale}</p>
                )}
                {reviewed && outcome && (
                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {RATING_LABELS[outcome.outcome_rating]}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">{outcome.actual_outcome}</p>
                    {outcome.lessons_learned && (
                      <p className="text-xs text-blue-600 mt-1 line-clamp-1">
                        💡 {outcome.lessons_learned}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">{format(new Date(d.created_at), 'MMM d, yyyy')}</p>
                <p className="text-xs text-gray-400 mt-0.5">Confidence: {d.confidence}/5</p>
                <button
                  onClick={onSignUp}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Lock size={10} />
                  Log your own
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}