import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'
import { publicPageMetadata } from '@/shared/lib/seo'
import { VERIFIED_SOCIAL_PROFILES } from '@/shared/lib/social'

export const metadata: Metadata = publicPageMetadata({
  title: 'Contact Simame - Laundry Support in Ghana',
  description:
    'Contact Simame for laundry pickup, delivery, customer support, partner onboarding, privacy, and account deletion requests in Ghana.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Simame home">
            <SimameLogo variant="lockup" />
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Contact Simame for laundry support and partner questions.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Use these official contact details for customer support, laundry partner onboarding, privacy requests, account deletion, and questions about Simame services in Ghana.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {VERIFIED_SOCIAL_PROFILES.map((profile) => (
              <Link key={profile.platform} href={profile.url} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:border-primary">
                {profile.platform}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold">Official contact details</h2>
          <div className="mt-6 space-y-5 text-sm">
            <a className="flex gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40" href="tel:+233200909897">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block font-semibold text-foreground">Phone</span>
                <span className="text-muted-foreground">+233 20 090 9897</span>
              </span>
            </a>
            <a className="flex gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40" href="tel:+233551057139">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block font-semibold text-foreground">Alternate phone</span>
                <span className="text-muted-foreground">+233 55 105 7139</span>
              </span>
            </a>
            <a className="flex gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40" href="mailto:info@simame.tech">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block font-semibold text-foreground">Email</span>
                <span className="text-muted-foreground">info@simame.tech</span>
              </span>
            </a>
            <div className="flex gap-3 rounded-lg border p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block font-semibold text-foreground">Service market</span>
                <span className="text-muted-foreground">Ghana</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}