import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import supabase from '@/config/supabase'

interface AuthContextValue { userId: string | null; loading: boolean; error: string | null }
const AuthContext = createContext<AuthContextValue>({ userId: null, loading: true, error: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // Try to get existing session
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return

        if (session?.user) {
          setUserId(session.user.id)
          setLoading(false)
          return
        }

        // Sign in anonymously
        const { data, error: signInErr } = await supabase.auth.signInAnonymously()
        if (cancelled) return

        if (signInErr) {
          console.error('Auth signIn error:', signInErr.message)
          setError(signInErr.message)
        } else if (data?.user) {
          setUserId(data.user.id)
        } else {
          setError('登录失败，请刷新重试')
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error('Auth init error:', e.message || e)
          setError(e.message || '登录失败')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  return <AuthContext.Provider value={{ userId, loading, error }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
