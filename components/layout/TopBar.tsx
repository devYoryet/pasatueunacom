'use client'

import { useState } from 'react'
import { Menu, Bell, Flame } from 'lucide-react'
import { getGreeting } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'

interface TopBarProps {
  profile: Profile
  onMenuClick: () => void
  streak?: number
}

export default function TopBar({ profile, onMenuClick, streak = 0 }: TopBarProps) {
  const greeting = getGreeting()
  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <div className="text-sm sm:text-base font-semibold text-slate-900">
            {greeting}, {profile.full_name.split(' ')[0]}
          </div>
          <div className="text-xs text-slate-400 hidden sm:block capitalize">{today}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {streak > 0 && (
          <Badge variant="warning" className="gap-1 hidden sm:flex">
            <Flame className="w-3 h-3" />
            {streak} días seguidos
          </Badge>
        )}
        <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors relative">
          <Bell className="w-5 h-5 text-slate-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-700 font-semibold text-sm">
            {profile.full_name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
