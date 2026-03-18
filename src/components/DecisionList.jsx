import { format } from 'date-fns'

const CATEGORY_COLORS = {
  Prioritization: 'bg-purple-50 text-purple-700',
  'Trade-off': 'bg-orange-50 text-orange-700',
  Stakeholder: 'bg-green-50 text-green-700',
  Technical: 'bg-blue-50 text-blue-700',
  Scope: 'bg-pink-50 text-pink-700',
}

const CONFIDENCE_LABEL = { 1: 'Very low', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Very high' }

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
      {decisions.map(d => {
        const reviewsDue = [
          { days: 30, due: d.review_30_due },
          { days: 60, due: d.review_60_due },
          { days: 90, due: d.review_90_due },
        ].filter(r => r.due && new Date(r.due) <= new Date())

        return (
          <div key={d.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[d.category] || 'bg-gray-100 text-gray-600'}`}>
                    {d.category}
                  </span>
                  {d.sprint_label && (
                    <span className="text-xs text-gray-400">{d.sprint_label}</span>
                  )}
                  {reviewsDue.length > 0 && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {reviewsDue.length} review{reviewsDue.length > 1 ? 's' : ''} due
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                {d.expected_outcome && (
                  <p className="text-xs text-gray-400 mt-1 truncate">Expected: {d.expected_outcome}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">{format(new Date(d.created_at), 'MMM d, yyyy')}</p>
                <p className="text-xs text-gray-400 mt-0.5">Confidence: {CONFIDENCE_LABEL[d.confidence]}</p>
                {reviewsDue.length > 0 && (
                  <button
                    onClick={() => onReview(d, reviewsDue[0].days)}
                    className="mt-2 text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    Review now →
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}