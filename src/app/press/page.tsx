import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Newspaper } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'
import { SOCIAL_PROFILES, VERIFIED_SOCIAL_PROFILES } from '@/shared/lib/social'

export const metadata: Metadata = publicPageMetadata({
  title: 'Simame Press and Media Kit',
  description:
    'Official Simame company facts, brand spelling, logo reference, social profile review status, and press contact information.',
  path: '/press',
})

export default function PressPage() {
  return (
    <PublicPageShell
      eyebrow="Press"
      path="/press"
      title="Official Simame facts for media, partners, and search engines."
      description="Use this page as the canonical public source for Simame brand spelling, company description, website, contact details, verified social profiles, and future press links."
      ctaHref="/contact"
      ctaLabel="Contact Simame"
    >
      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold">Company summary</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Simame is a Ghanaian digital laundry marketplace and laundry connect platform that helps customers arrange laundry services with participating providers. The platform supports service discovery, pickup and delivery workflows, order tracking, pricing operations, and tools for laundry businesses.
          </p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold">Brand</dt><dd className="text-muted-foreground">Simame</dd></div>
            <div><dt className="font-semibold">Handle</dt><dd className="text-muted-foreground">@simameapp</dd></div>
            <div><dt className="font-semibold">Website</dt><dd><Link className="text-primary hover:underline" href="https://simame.tech">simame.tech</Link></dd></div>
            <div><dt className="font-semibold">Contact</dt><dd><Link className="text-primary hover:underline" href="mailto:info@simame.tech">info@simame.tech</Link></dd></div>
          </dl>
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold">Brand asset</h2>
          <div className="mt-5 rounded-lg border bg-background p-6">
            <Image src="/images/SIMAME_BRAND_LOGO-01.png" alt="Official Simame brand logo" width={520} height={260} className="h-auto w-full" />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Use the Simame spelling consistently. Additional approved screenshots, founder bios, and press milestones should be added only after founder review.</p>
        </section>
      </div>

      <section className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold">Verified social graph</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {VERIFIED_SOCIAL_PROFILES.map((profile) => (
            <Link key={profile.platform} href={profile.url} className="rounded-md border p-4 text-sm hover:border-primary">
              <span className="font-semibold">{profile.platform}</span>
              <span className="mt-1 flex items-center gap-2 text-muted-foreground">
                {profile.handle}
                <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border bg-muted/30 p-6">
        <div className="flex items-center gap-3">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Founder review queue</h2>
        </div>
        <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
          {SOCIAL_PROFILES.filter((profile) => profile.status !== 'verified').map((profile) => (
            <li key={profile.platform}>{profile.platform}: {profile.action}</li>
          ))}
          <li>Press links, awards, competitions, and Connect Laundry history should not be published as facts until externally verified or founder-approved.</li>
        </ul>
      </section>
    </PublicPageShell>
  )
}