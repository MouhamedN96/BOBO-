'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/supabase/auth'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const init = async () => {
      try {
        const { data: { session }, error: sessionError } = await auth.getSession()

        if (abortController.signal.aborted) return

        if (sessionError) throw sessionError

        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id, abortController.signal)
        } else {
          setLoading(false)
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Auth initialization failed:', err)
          setError(err instanceof Error ? err : new Error('Unknown auth error'))
          setLoading(false)
        }
      }
    }

    init()

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      if (abortController.signal.aborted) return

      setUser(session?.user ?? null)
      setError(null) // Clear errors on auth state change

      if (session?.user) {
        await loadProfile(session.user.id, abortController.signal)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      abortController.abort()
      subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string, signal?: AbortSignal) => {
    try {
      const { data, error } = await auth.getUserProfile(userId)

      if (signal?.aborted) return

      if (error) throw error

      if (data) {
        setProfile(data)
        setError(null)
      }
    } catch (err) {
      if (!signal?.aborted) {
        console.error('Profile load failed:', err)
        setError(err instanceof Error ? err : new Error('Failed to load profile'))
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await auth.signIn(email, password)
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    const result = await auth.signUp(email, password, username)
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    const result = await auth.signOut()
    setUser(null)
    setProfile(null)
    setLoading(false)
    return result
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    setLoading(true)
    const result = await auth.updateProfile(user.id, updates)
    if (!result.error && result.data) {
      setProfile(result.data)
    }
    setLoading(false)
    return result
  }

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  }
}
