import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'

export const metadata: Metadata = {
  title: 'NJOOBA - Pan-African Developer Community',
  description: 'Learn, engage, develop, connect, and grow with developers across Africa',
  keywords: ['developers', 'africa', 'community', 'tech', 'pan-african', 'learning', 'njooba'],
  authors: [{ name: 'NJOOBA Team' }],
  openGraph: {
    title: 'NJOOBA - Pan-African Developer Community',
    description: 'Where African developers grow together',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="texture-mudcloth">
        <ErrorBoundary>
          <div className="min-h-screen">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
