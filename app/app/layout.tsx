'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'
import { Skeleton } from '@/components/ui/skeleton'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profileData) {
        router.push('/login')
        return
      }

      setProfile(profileData)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-eunacom-bg flex">
        <div className="hidden lg:block w-60 bg-white border-r border-slate-200" />
        <div className="flex-1 lg:ml-60">
          <div className="h-16 bg-white border-b border-slate-200" />
          <div className="p-6 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-eunacom-bg flex">
      <Sidebar
        profile={profile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <TopBar
          profile={profile}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
