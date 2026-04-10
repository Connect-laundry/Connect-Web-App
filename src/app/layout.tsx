import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { PwaRegister } from '@/shared/components/PwaRegister'
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
  title: 'Connect Laundry — Professional Laundry & Dry Cleaning Services',
  description: 'Premium laundry, dry cleaning, and garment care with free pickup and delivery. Fresh, clean clothes delivered to your door.',
  generator: 'connectlaundry.app',
  applicationName: 'Connect Laundry',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Connect',
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
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <PwaRegister />
        <Analytics />
      </body>
    </html>
  )
}

