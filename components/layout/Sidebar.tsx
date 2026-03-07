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
  { icon: BookOpen, label: 'Especialidades', href: '/app/specialties' },
  { icon: Target, label: 'Practicar', href: '/app/specialties' },
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
      <div className="p-6 border-b border-slate-100">
        <Link href="/app/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">PE</span>
          </div>
          <div>
            <div className="font-heading font-bold text-slate-900 text-sm leading-tight">PasaTuEunacom</div>
            <div className="text-xs text-slate-400">Preparación EUNACOM</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onMobileClose}
              className={cn('sidebar-item', isActive && 'sidebar-item-active')}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-semibold text-sm">
              {profile.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{profile.full_name}</div>
            <div className="text-xs text-slate-400 truncate">{profile.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-700 transition-colors"
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
      <div className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <div className="relative w-72 bg-white h-full shadow-xl">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100"
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
