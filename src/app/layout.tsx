import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { PwaRegister } from '@/shared/components/PwaRegister'
import { AppToaster } from '@/shared/components/AppToaster'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f766e',
}

export const metadata: Metadata = {
  title: 'SIMAME — Professional Laundry & Dry Cleaning Services',
  description: 'Premium laundry, dry cleaning, and garment care with free pickup and delivery. Fresh, clean clothes delivered to your door.',
  generator: 'simame.tech',
  applicationName: 'SIMAME',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SIMAME',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/pwa-icon-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/pwa-icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: '/apple-icon.png',
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <AppToaster />
        </AuthProvider>
        <PwaRegister />
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
