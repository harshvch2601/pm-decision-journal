export default function StatsCard({ label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
  }

  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    amber: 'bg-amber-50',
    purple: 'bg-purple-50',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        {label}
      </p>
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${bgColors[color]}`}>
        <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
      </div>
      {sub && (
        <p className="text-xs text-gray-400">{sub}</p>
      )}
    </div>
  )
}