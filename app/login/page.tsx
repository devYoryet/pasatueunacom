'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

const quotes = [
  '"El medico del futuro no dara medicamentos, sino que educara a sus pacientes en el cuidado del cuerpo humano." — Thomas Edison',
  '"La medicina es una ciencia de la incertidumbre y un arte de la probabilidad." — William Osler',
  '"El primer deber del medico es educar a las masas para que no necesiten medico." — Martin H. Fischer',
  '"La salud no lo es todo, pero sin salud, todo lo demas es nada." — Arthur Schopenhauer',
  '"El EUNACOM es el primer paso hacia servir a Chile con excelencia medica."',
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email o contrasena incorrectos')
        } else {
          toast.error('Error al iniciar sesion. Intenta de nuevo.')
        }
        return
      }

      toast.success('Bienvenido de vuelta')
      router.push('/app/dashboard')
      router.refresh()
    } catch {
      toast.error('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 to-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-teal-700/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl" />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg font-mono">EG</span>
            </div>
            <span className="font-heading font-bold text-white text-xl">EunacomGo</span>
          </Link>
        </div>

        <div className="relative">
          <div className="w-12 h-0.5 bg-teal-400 mb-6" />
          <blockquote className="text-slate-300 text-lg leading-relaxed italic mb-4">
            {quotes[quoteIndex]}
          </blockquote>
          <div className="flex gap-2 mt-4">
            {quotes.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === quoteIndex ? 'w-6 bg-teal-400' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative text-slate-500 text-sm">
          Para medicos que ejercen en Chile
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">EG</span>
            </div>
            <span className="font-heading font-bold text-slate-900">EunacomGo</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-slate-500 mb-8">
            Ingresa tus datos para continuar practicando.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                {...register('email')}
                className={errors.email ? 'border-red-400 focus:ring-red-300' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contrasena</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contrasena"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`pr-10 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white min-h-[44px]"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar sesion'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No tienes cuenta?{' '}
            <Link href="/register" className="text-teal-600 font-medium hover:underline">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
