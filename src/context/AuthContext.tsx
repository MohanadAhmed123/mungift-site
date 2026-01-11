import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

type AuthContextType = {
  user: {
    id: string
    email: string | null
  } | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    // Stay logged in on page refresh
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session)
    })

    // Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe() // in case app unmounts to prevent memory leak
    }
  }, [])

  async function handleSession(session: any) {
    
    //logged out
    if (!session) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }
    // auth session exists
    const authUser = session.user
    setUser({ id: authUser.id, email: authUser.email })

    // Fetch user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setProfile(profileData)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut() //automatically triggers onAuthStateChange and clears auth session
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
