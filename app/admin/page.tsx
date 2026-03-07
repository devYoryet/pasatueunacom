'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, BookOpen, FileText, Upload, Sparkles, TrendingUp } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalQuestions: number
  totalAttempts: number
  recentImports: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()

      const [usersRes, questionsRes, attemptsRes] = await Promise.all([
        supabase.from('profiles').select('id, subscription_status').eq('role', 'student'),
        supabase.from('questions').select('id').eq('is_active', true),
        supabase.from('attempts').select('id').eq('is_completed', true),
      ])

      const users = usersRes.data ?? []
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.subscription_status === 'active').length,
        totalQuestions: questionsRes.data?.length ?? 0,
        totalAttempts: attemptsRes.data?.length ?? 0,
        recentImports: 0,
      })
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    )
  }

  const quickLinks = [
    { icon: Users, label: 'Gestionar usuarios', desc: 'Activar/desactivar suscripciones', href: '/admin/users', color: 'text-blue-600 bg-blue-50' },
    { icon: BookOpen, label: 'Banco de preguntas', desc: 'Crear, editar y gestionar preguntas', href: '/admin/questions', color: 'text-purple-600 bg-purple-50' },
    { icon: Upload, label: 'Importar preguntas', desc: 'Pegar texto o subir imágenes de Moodle', href: '/admin/import', color: 'text-green-600 bg-green-50' },
    { icon: Sparkles, label: 'Generar con IA', desc: 'Crear variantes automáticamente', href: '/admin/generate', color: 'text-orange-600 bg-orange-50' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="section-title">Panel de administración</h1>
        <p className="text-slate-500 text-sm mt-1">Gestión completa de PasaTuEunacom</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Usuarios totales', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-600' },
          { label: 'Suscriptores activos', value: stats?.activeUsers ?? 0, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Preguntas activas', value: stats?.totalQuestions ?? 0, icon: BookOpen, color: 'text-purple-600' },
          { label: 'Intentos completados', value: stats?.totalAttempts ?? 0, icon: FileText, color: 'text-orange-600' },
        ].map((stat) => (
          <div key={stat.label} className="stats-card">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
            <div className="text-2xl font-heading font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* QUICK LINKS */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-slate-800 mb-4">Acciones rápidas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${link.color}`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{link.label}</div>
                    <div className="text-sm text-slate-500">{link.desc}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
