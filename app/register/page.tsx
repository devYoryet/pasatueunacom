'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const passwordValue = watch('password', '')

  const passwordStrength = {
    length: passwordValue.length >= 8,
    upper: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })

      // Debug: ver en consola qué devuelve Supabase
      console.log('[Register] signUp response:', {
        user: authData?.user?.id,
        email: authData?.user?.email,
        identitiesCount: authData?.user?.identities?.length,
        hasSession: !!authData?.session,
        needsConfirmation: authData?.user && !authData?.session,
        error: error?.message,
      })

      if (error) {
        console.error('[Register] Supabase error:', error.message, error)
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          toast.error('Este email ya está registrado. Intenta iniciar sesión.')
        } else {
          toast.error(error.message || 'Error al registrarse. Intenta de nuevo.')
        }
        return
      }

      // Supabase puede devolver usuario sin sesión si pide confirmación de email
      if (authData?.user && !authData?.session) {
        setSuccess(true)
        toast.success('Cuenta creada. Revisa tu email para confirmar y luego inicia sesión.')
        return
      }

      setSuccess(true)
      toast.success('Cuenta creada. Revisa tu email para confirmarla.')
    } catch (err) {
      console.error('[Register] Unexpected error:', err)
      const message = err instanceof Error ? err.message : 'Error inesperado. Intenta de nuevo.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">
            ¡Cuenta creada!
          </h2>
          <p className="text-slate-500 mb-6">
            Revisa tu email y confirma tu cuenta para poder ingresar.
            Luego contacta al administrador para activar tu suscripción.
          </p>
          <Link href="/login">
            <Button className="w-full">Ir a iniciar sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-700/20 blur-3xl" />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-lg font-mono">Go</span>
            </div>
            <span className="font-heading font-bold text-white text-xl">EunacomGo</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <div>
            <div className="text-3xl font-heading font-bold text-white mb-3">
              Únete a los médicos que aprueban.
            </div>
            <p className="text-blue-200 leading-relaxed">
              1.000+ preguntas clínicas, retroalimentación experta y estadísticas
              reales para que sepas exactamente dónde mejorar.
            </p>
          </div>
          <div className="space-y-3">
            {[
              'Más de 960 preguntas de Medicina Interna',
              'Cuestionarios por especialidad y tema',
              'Simulacro EUNACOM de 180 preguntas',
              'Estadísticas de progreso detalladas',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-blue-100 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-blue-300 text-sm">
          Construido para médicos chilenos 🇨🇱
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">Go</span>
            </div>
            <span className="font-heading font-bold text-slate-900">EunacomGo</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-2">
            Crea tu cuenta gratis
          </h1>
          <p className="text-slate-500 mb-8">
            Empieza a practicar en segundos.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                placeholder="Dr. Juan Pérez"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-400' : ''}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                className={errors.email ? 'border-red-400' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  {...register('password')}
                  className={`pr-10 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordValue && (
                <div className="flex gap-2 mt-2">
                  {[
                    { ok: passwordStrength.length, label: '8+ chars' },
                    { ok: passwordStrength.upper, label: 'Mayúscula' },
                    { ok: passwordStrength.number, label: 'Número' },
                  ].map((req) => (
                    <div
                      key={req.label}
                      className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                        req.ok
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta gratis'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            Al registrarte aceptas los{' '}
            <a href="#" className="underline">Términos de servicio</a>{' '}
            y la{' '}
            <a href="#" className="underline">Política de privacidad</a>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
