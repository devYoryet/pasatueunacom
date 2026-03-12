import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

const baseUrl = 'https://eunacomgo.cl'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'EunacomGo — Preparación EUNACOM Chile | Banco de Preguntas y Simulacros',
    template: '%s | EunacomGo',
  },
  description:
    'La plataforma #1 de preparación para el EUNACOM en Chile. Practica con preguntas clínicas reales, simulacros cronometrados y estadísticas de progreso. Aprueba el EUNACOM con confianza.',
  keywords: [
    'EUNACOM',
    'preparación EUNACOM',
    'banco preguntas EUNACOM',
    'simulacro EUNACOM',
    'EUNACOM Chile',
    'examen médico Chile',
    'EunacomGo',
    'medicina Chile',
    'preguntas medicina interna',
    'EUNACOM 2026',
    'normativa EUNACOM 2026',
    'EUNACOM online',
    'preparar EUNACOM',
    'médico Chile sistema público',
    'beca especialidad Chile',
  ],
  authors: [{ name: 'EunacomGo', url: baseUrl }],
  creator: 'EunacomGo',
  publisher: 'EunacomGo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: baseUrl,
    siteName: 'EunacomGo',
    title: 'EunacomGo — Preparación EUNACOM Chile',
    description:
      'Estudia inteligente. Aprueba seguro. Banco de preguntas clínicas, simulacros cronometrados y estadísticas reales para el EUNACOM.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'EunacomGo — Plataforma de preparación EUNACOM Chile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@eunacomgo',
    creator: '@eunacomgo',
    title: 'EunacomGo — Preparación EUNACOM Chile',
    description:
      'Banco de preguntas clínicas, simulacros cronometrados y estadísticas reales para el EUNACOM.',
    images: [`${baseUrl}/og-image.png`],
  },
  verification: {
    google: '',
  },
  category: 'education',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${baseUrl}/#organization`,
  name: 'EunacomGo',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  description:
    'EunacomGo es la plataforma líder de preparación para el EUNACOM en Chile. Ofrecemos banco de preguntas clínicas, simulacros cronometrados y análisis de progreso para médicos que buscan ejercer en el sistema público chileno.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CL',
  },
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Planes de preparación EUNACOM',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: 'Preparación EUNACOM — Banco de preguntas',
          description:
            'Acceso completo al banco de preguntas clínicas EUNACOM con simulacros cronometrados, estadísticas y retroalimentación inmediata.',
          provider: {
            '@type': 'Organization',
            name: 'EunacomGo',
            url: baseUrl,
          },
          educationalLevel: 'Professional',
          inLanguage: 'es',
          teaches: [
            'Medicina Interna',
            'Pediatría',
            'Cirugía',
            'Obstetricia y Ginecología',
            'Salud Pública',
            'Psiquiatría',
          ],
        },
      },
    ],
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: 'EunacomGo',
  url: baseUrl,
  description: 'Plataforma de preparación para el EUNACOM en Chile',
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'es-CL',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: baseUrl,
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
