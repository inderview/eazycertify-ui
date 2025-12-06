'use client'

import { useEffect, useMemo, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const syncedUsers = useRef<Set<string>>(new Set())

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Only sync if we haven't already synced this user in this session
        if (syncedUsers.current.has(session.user.id)) {
          console.log('User already synced in this session, skipping')
          return
        }

        try {
          const response = await fetch(`${API_BASE}/users/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              provider: session.user.app_metadata?.provider || 'email',
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Failed to sync user - Response:', response.status, errorText)
          } else {
            const result = await response.json()
            console.log('User synced successfully:', result)
            // Mark this user as synced
            syncedUsers.current.add(session.user.id)
          }
        } catch (error) {
          console.error('Failed to sync user - Error:', error)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return <>{children}</>
}
