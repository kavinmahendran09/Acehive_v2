import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { PostHogProvider } from '@/components/PostHogProvider'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { GoogleAdSense } from '@/components/GoogleAdSense'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Acehive',
  description: 'Acehive - Your go-to resource hub for SRM University! Access CT papers, semester materials, study guides, and more. Streamline your academic success with our user-friendly platform designed for efficient learning!',
  generator: 'v0.dev',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <GoogleAnalytics />
        <GoogleAdSense />
        <PostHogProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  )
}
