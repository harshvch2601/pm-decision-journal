import { supabase } from '../lib/supabaseClient'
import { LogOut, BookOpen } from 'lucide-react'
import { track } from '../lib/analytics'

export default function NavBar({ session, currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'decisions', label: 'My Decisions' },
    { id: 'review', label: 'Review Queue' },
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">PM Decision Journal</span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id) 
                track('page_viewed', { page: item.id })}}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>

      </div>
    </nav>
  )
}