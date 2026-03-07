import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PasaTuEunacom — Preparación EUNACOM Chile',
  description:
    'Más de 1.000 preguntas clínicas con retroalimentación experta, organizadas por especialidad, con cronómetro y estadísticas reales de progreso.',
  keywords: ['EUNACOM', 'medicina', 'Chile', 'preparación', 'preguntas', 'médico'],
  authors: [{ name: 'PasaTuEunacom' }],
  openGraph: {
    title: 'PasaTuEunacom — Preparación EUNACOM Chile',
    description: 'Estudia inteligente. Aprueba seguro.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'var(--font-inter)',
            },
          }}
        />
      </body>
    </html>
  )
}
