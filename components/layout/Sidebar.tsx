'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  Target,
  BarChart3,
  Clock,
  Map,
  Settings,
  LogOut,
  X,
  CalendarDays,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Profile } from '@/lib/supabase/types'

interface SidebarProps {
  profile: Profile
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const navItems = [
  { icon: Home, label: 'Inicio', href: '/app/dashboard' },
  { icon: CalendarDays, label: 'Calendario del Curso', href: '/app/calendar' },
  { icon: BookOpen, label: 'Especialidades', href: '/app/specialties' },
  { icon: BarChart3, label: 'Mi Progreso', href: '/app/stats' },
  { icon: Clock, label: 'Historial', href: '/app/history' },
  { icon: Map, label: 'Cobertura EUNACOM', href: '/app/coverage' },
  { icon: Settings, label: 'Configuración', href: '/app/settings' },
]

export default function Sidebar({ profile, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/app/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">Go</span>
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-tight">EunacomGo</div>
            <div className="text-xs text-white/50">Preparación EUNACOM</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-white/75 hover:text-white hover:bg-white/12'
              )}
            >
              <item.icon size={17} className="flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {profile.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{profile.full_name}</div>
            <div className="text-xs text-white/45 truncate">{profile.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white/80 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-60 bg-[#1c2c3e] fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="relative w-64 bg-[#1c2c3e] h-full shadow-xl">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
