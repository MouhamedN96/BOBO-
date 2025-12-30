import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'

export const viewport: Viewport = {
  themeColor: '#E65100',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'NJOOBA - Pan-African Developer Community',
  description: 'Learn, engage, develop, connect, and grow with developers across Africa',
  manifest: '/manifest.json',
  keywords: ['developers', 'africa', 'community', 'tech', 'pan-african', 'learning', 'njooba'],
  authors: [{ name: 'NJOOBA Team' }],
  openGraph: {
    title: 'NJOOBA - Pan-African Developer Community',
    description: 'Where African developers grow together',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NJOOBA',
  },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="texture-mudcloth overscroll-none">
        <ErrorBoundary>
          <div className="min-h-screen">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
