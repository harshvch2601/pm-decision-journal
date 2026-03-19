import StatsCard from '../components/StatsCard'
import { Brain, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, ReferenceLine
} from 'recharts'

export default function DemoAnalyticsDashboard({ decisions, patterns, onSignUp }) {
  const reviewed = decisions.filter(d => d.outcomes?.length > 0)
  const allScores = reviewed.flatMap(d => d.outcomes.map(o => o.accuracy_score))
  const avgAccuracy = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)

  const categoryData = ['Prioritization', 'Trade-off', 'Stakeholder', 'Technical', 'Scope'].map(cat => {
    const catDecisions = reviewed.filter(d => d.category === cat)
    const scores = catDecisions.flatMap(d => d.outcomes.map(o => o.accuracy_score))
    return {
      category: cat,
      accuracy: scores.length ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0,
      count: catDecisions.length
    }
  }).filter(d => d.count > 0)

  const calibrationData = reviewed.flatMap(d =>
    d.outcomes.map(o => ({ confidence: d.confidence, accuracy: o.accuracy_score }))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Sample PM decision intelligence — 8 decisions, 6 reviewed</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Decisions" value={decisions.length} sub="logged" color="blue" />
        <StatsCard label="Reviewed" value={reviewed.length} sub="with outcomes" color="green" />
        <StatsCard label="Avg Accuracy" value={avgAccuracy} sub="out of 5" color="purple" />
        <StatsCard label="Reviews Due" value={2} sub="awaiting review" color="amber" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Accuracy by Category</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val) => [`${val}/5`, 'Avg Accuracy']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} fill="#3b82f6"
              label={{ position: 'top', fontSize: 11, fill: '#6b7280' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
  <h3 className="font-semibold text-gray-900 text-sm mb-1">
    Confidence vs Actual Accuracy
  </h3>
  <p className="text-xs text-gray-400 mb-1">
    Each dot = one reviewed decision. Are you more accurate when you're more confident?
  </p>
  <div className="flex items-center gap-4 mb-4">
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-purple-400 opacity-70" />
      <span className="text-xs text-gray-400">One decision</span>
    </div>
    <div className="text-xs text-gray-400">
      X axis = your confidence when you made the call (1–5)
    </div>
    <div className="text-xs text-gray-400">
      Y axis = Claude's accuracy score 30/60/90 days later (1–5)
    </div>
  </div>
  <ResponsiveContainer width="100%" height={220}>
    <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis
        dataKey="confidence"
        name="Confidence"
        type="number"
        domain={[0.5, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        tick={{ fontSize: 11 }}
        label={{
          value: '← Less confident   Confidence when decided   More confident →',
          position: 'insideBottom',
          offset: -12,
          fontSize: 10,
          fill: '#9ca3af'
        }}
      />
      <YAxis
        dataKey="accuracy"
        name="Accuracy"
        type="number"
        domain={[0.5, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        tick={{ fontSize: 11 }}
        label={{
          value: 'Accuracy',
          angle: -90,
          position: 'insideLeft',
          offset: 10,
          fontSize: 10,
          fill: '#9ca3af'
        }}
      />
      <Tooltip
        contentStyle={{ fontSize: 12, borderRadius: 8 }}
        formatter={(val, name) => [`${val}/5`, name === 'confidence' ? 'Confidence' : 'Accuracy']}
        labelFormatter={() => ''}
      />
      <Scatter data={calibrationData} fill="#8b5cf6" opacity={0.7} r={7} />
    </ScatterChart>
  </ResponsiveContainer>
  <div className="flex justify-between text-xs text-gray-300 px-8 mt-1">
    <span>1 = Completely wrong</span>
    <span>3 = Partially right</span>
    <span>5 = Spot on</span>
  </div>
</div>

      {/* AI Insights — pre-loaded for demo */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">AI Pattern Analysis</h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Demo results</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">{patterns.summary}</p>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={13} className="text-amber-500" />
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Blind Spots</p>
            </div>
            {patterns.blindSpots.map((b, i) => (
              <p key={i} className="text-sm text-gray-600 bg-amber-50 rounded-lg px-3 py-2 mb-1.5">{b}</p>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp size={13} className="text-green-500" />
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Strengths</p>
            </div>
            {patterns.strengths.map((s, i) => (
              <p key={i} className="text-sm text-gray-600 bg-green-50 rounded-lg px-3 py-2 mb-1.5">{s}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Signup CTA */}
      <div className="bg-blue-600 rounded-2xl p-6 text-center">
        <p className="text-white font-bold text-lg mb-1">Ready to track your own decisions?</p>
        <p className="text-blue-200 text-sm mb-4">Free forever. Your data stays private. Takes 60 seconds to log your first decision.</p>
        <button
          onClick={onSignUp}
          className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
        >
          <Sparkles size={14} />
          Create free account
        </button>
      </div>
    </div>
  )
}