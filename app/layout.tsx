import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'EunacomGo — Plataforma de preparación EUNACOM Chile',
  description:
    'EunacomGo es una plataforma de preparación para el EUNACOM en Chile con preguntas clínicas, simulacros cronometrados y estadísticas reales de progreso.',
  keywords: ['EUNACOM', 'medicina', 'Chile', 'preparación', 'preguntas', 'médico', 'EunacomGo'],
  authors: [{ name: 'EunacomGo' }],
  openGraph: {
    title: 'EunacomGo — Preparación EUNACOM Chile',
    description: 'Estudia inteligente. Aprueba seguro con simulacros clínicos enfocados en el EUNACOM.',
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
        {/* SEO estructurado básico */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'EunacomGo',
              url: 'https://eunacomgo.cl',
              description:
                'EunacomGo es una plataforma de preparación para el EUNACOM en Chile con preguntas clínicas, simulacros y estadísticas.',
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'EunacomGo',
              url: 'https://eunacomgo.cl',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://eunacomgo.cl/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
