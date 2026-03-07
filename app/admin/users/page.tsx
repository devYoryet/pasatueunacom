'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Search, UserCheck, UserX, RefreshCw } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleSubscription = async (userId: string, currentStatus: string) => {
    setTogglingId(userId)
    const supabase = createClient()
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: newStatus })
      .eq('id', userId)

    if (error) {
      toast.error('Error al actualizar suscripción')
    } else {
      toast.success(`Suscripción ${newStatus === 'active' ? 'activada' : 'desactivada'}`)
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, subscription_status: newStatus as any } : u)
      )
    }
    setTogglingId(null)
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && u.subscription_status === 'active') ||
      (filter === 'inactive' && u.subscription_status !== 'active')
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <Skeleton className="h-96" />
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} usuarios registrados</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="text-left pb-3 font-medium">Usuario</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell">Email</th>
                  <th className="text-center pb-3 font-medium">Suscripción</th>
                  <th className="text-right pb-3 font-medium hidden md:table-cell">Registro</th>
                  <th className="text-right pb-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 font-semibold text-sm">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{user.full_name}</div>
                          <div className="text-xs text-slate-400 sm:hidden">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell text-slate-500">{user.email}</td>
                    <td className="py-3 text-center">
                      {user.subscription_status === 'active' ? (
                        <Badge variant="success">Activa</Badge>
                      ) : user.subscription_status === 'trial' ? (
                        <Badge variant="warning">Trial</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right text-slate-400 text-xs hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString('es-CL')}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant={user.subscription_status === 'active' ? 'outline' : 'default'}
                        onClick={() => toggleSubscription(user.id, user.subscription_status)}
                        disabled={togglingId === user.id}
                        className="gap-1.5 text-xs"
                      >
                        {user.subscription_status === 'active' ? (
                          <><UserX className="w-3.5 h-3.5" />Desactivar</>
                        ) : (
                          <><UserCheck className="w-3.5 h-3.5" />Activar</>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">
                No se encontraron usuarios.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
