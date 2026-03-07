'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { LogOut, User } from 'lucide-react'
import type { Profile } from '@/lib/supabase/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setName(data?.full_name ?? '')
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', profile.id)

    if (error) {
      toast.error('Error al guardar')
    } else {
      toast.success('Perfil actualizado')
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <Skeleton className="h-64" />

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="section-title">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona tu perfil y cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre completo</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={profile?.email ?? ''} disabled className="bg-slate-50" />
          </div>
          <div className="space-y-1.5">
            <Label>Estado de suscripción</Label>
            <div className="flex items-center gap-2 mt-1">
              {profile?.subscription_status === 'active' ? (
                <Badge variant="success">Activa</Badge>
              ) : profile?.subscription_status === 'trial' ? (
                <Badge variant="warning">Trial</Badge>
              ) : (
                <Badge variant="secondary">Inactiva</Badge>
              )}
              {profile?.subscription_status !== 'active' && (
                <span className="text-sm text-slate-500">
                  Contacta al administrador para activar tu suscripción.
                </span>
              )}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
