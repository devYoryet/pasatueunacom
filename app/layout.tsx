import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

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
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}
