import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ReviewModal from '../components/ReviewModal'
import { format, isPast } from 'date-fns'

export default function ReviewQueue({ session }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchReviews = async () => {
    const { data: decisions } = await supabase
      .from('decisions')
      .select('*, outcomes(review_window)')
      .order('created_at', { ascending: false })

    const queue = []
    decisions?.forEach(d => {
      const completed = d.outcomes?.map(o => o.review_window) || []
      ;[
        { window: 30, due: d.review_30_due },
        { window: 60, due: d.review_60_due },
        { window: 90, due: d.review_90_due },
      ].forEach(({ window, due }) => {
        if (due && isPast(new Date(due)) && !completed.includes(window)) {
          queue.push({ ...d, reviewWindow: window, dueDate: due })
        }
      })
    })

    setItems(queue)
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  if (loading) return (
    <div className="text-center py-20 text-gray-400 text-sm">Loading review queue...</div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {items.length === 0
            ? 'All caught up — no reviews due'
            : `${items.length} decision${items.length !== 1 ? 's' : ''} waiting for your review`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-medium text-gray-500">No reviews due right now</p>
          <p className="text-sm text-gray-400 mt-1">Check back when your 30/60/90 day windows open</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={`${item.id}-${item.reviewWindow}`}
              className="bg-white rounded-xl border-2 border-amber-200 p-5 hover:border-amber-400 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {item.reviewWindow}-day review due
                    </span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                  {item.expected_outcome && (
                    <p className="text-xs text-gray-400 mt-1">Expected: {item.expected_outcome}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 mb-2">
                    Due {format(new Date(item.dueDate), 'MMM d')}
                  </p>
                  <button
                    onClick={() => setSelected(item)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Start review →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ReviewModal
          decision={selected}
          reviewWindow={selected.reviewWindow}
          onClose={() => setSelected(null)}
          onComplete={() => { setSelected(null); fetchReviews() }}
        />
      )}
    </div>
  )
}