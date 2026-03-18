import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import NavBar from '../components/NavBar'
import DecisionForm from '../components/DecisionForm'
import DecisionList from '../components/DecisionList'
import ReviewQueue from './ReviewQueue'
import ReviewModal from '../components/ReviewModal'
import { PlusCircle, X } from 'lucide-react'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function Dashboard({ session }) {
  const [currentPage, setCurrentPage] = useState('decisions')
  const [decisions, setDecisions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviewTarget, setReviewTarget] = useState(null)

  const fetchDecisions = async () => {
    const { data } = await supabase
      .from('decisions')
      .select('*, outcomes(review_window)')
      .order('created_at', { ascending: false })
    setDecisions(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchDecisions() }, [])

  const handleReview = (decision, window) => {
    setReviewTarget({ ...decision, reviewWindow: window })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar session={session} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {currentPage === 'decisions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Decisions</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {decisions.length} decision{decisions.length !== 1 ? 's' : ''} logged
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {showForm
                  ? <><X size={14} />Cancel</>
                  : <><PlusCircle size={14} />Log Decision</>}
              </button>
            </div>

            {showForm && (
              <div className="mb-6">
                <DecisionForm
                  session={session}
                  onSuccess={() => { setShowForm(false); fetchDecisions() }}
                />
              </div>
            )}

            {loading ? (
              <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
            ) : (
              <DecisionList decisions={decisions} onReview={handleReview} />
            )}
          </div>
        )}

        {currentPage === 'review' && <ReviewQueue session={session} />}

        {currentPage === 'dashboard' && <AnalyticsDashboard />}

      </main>

      {reviewTarget && (
        <ReviewModal
          decision={reviewTarget}
          reviewWindow={reviewTarget.reviewWindow}
          onClose={() => setReviewTarget(null)}
          onComplete={() => { setReviewTarget(null); fetchDecisions() }}
        />
      )}
    </div>
  )
}