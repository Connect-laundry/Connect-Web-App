import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { PwaRegister } from '@/shared/components/PwaRegister'
import { AppToaster } from '@/shared/components/AppToaster'
import { SEO_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, isSearchIndexingDisabled } from '@/shared/lib/seo'
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Simame - Laundry Pickup and Delivery in Ghana',
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_DESCRIPTION,
  generator: 'simame.tech',
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Simame - Laundry Pickup and Delivery in Ghana',
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_GH',
    images: [
      {
        url: absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png'),
        width: 1200,
        height: 630,
        alt: 'Simame laundry pickup and delivery in Ghana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simame - Laundry Pickup and Delivery in Ghana',
    description: SEO_DESCRIPTION,
    images: [absoluteUrl('/images/SIMAME_BRAND_LOGO-01.png')],
  },
  robots: isSearchIndexingDisabled()
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
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
