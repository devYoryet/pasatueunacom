'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  BookOpen,
  FileText,
  Upload,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Usuarios', href: '/admin/users' },
  { icon: BookOpen, label: 'Preguntas', href: '/admin/questions' },
  { icon: FileText, label: 'Exámenes', href: '/admin/exams' },
  { icon: Upload, label: 'Importar', href: '/admin/import' },
  { icon: Sparkles, label: 'Generar con IA', href: '/admin/generate' },
  { icon: BarChart3, label: 'Estadísticas', href: '/admin/stats' },
  { icon: Settings, label: 'Configuración', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        toast.error('Acceso denegado')
        router.push('/app/dashboard')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400">Verificando acceso...</div>
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white border border-emerald-200 rounded-lg flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-sm font-mono">Go</span>
          </div>
          <div>
            <div className="font-heading font-bold text-slate-900 text-sm">Admin Panel</div>
            <div className="text-xs text-slate-400">EunacomGo</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn('sidebar-item', isActive && 'sidebar-item-active')}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Link href="/app/dashboard" className="sidebar-item mb-1 block">
          <span className="text-xs">← Vista estudiante</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-item w-full text-red-500 hover:text-red-700 hover:bg-red-50">
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-medium text-slate-500">
            Admin Panel
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
