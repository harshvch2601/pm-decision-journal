import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { identifyUser, resetUser } from './lib/analytics'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        identifyUser(session.user.id, session.user.email)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session?.user) {
          identifyUser(session.user.id, session.user.email)
        } else {
          resetUser()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  )

  return session ? <Dashboard session={session} /> : <Auth />
}

export default App