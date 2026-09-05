import type { Metadata } from 'next'
import {
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  Code2,
  Link as LinkIcon,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'For Laundry Businesses - Partner with Simame in Ghana',
  description:
    'Join Simame as a verified laundry partner in Ghana. Access our provider operating system, digital order management, customer discovery, and embeddable partner booking badges.',
  path: '/for-laundries',
})

const capabilities = [
  {
    title: 'Digital Storefront Profile',
    description:
      'Showcase your business address, opening hours, active service radiuses, and high-resolution shop imagery to local customers.',
    icon: Store,
  },
  {
    title: 'Custom Pricing & Service Models',
    description:
      'Configure per-garment catalog pricing, weight-based (per kg) pricing, express turnaround premiums, and custom delivery zones.',
    icon: CircleDollarSign,
  },
  {
    title: 'Live Order Management',
    description:
      'Track orders from initial pickup through weighing, processing, quality check, and final doorstep delivery with live status alerts.',
    icon: CalendarClock,
  },
  {
    title: 'Staff & Driver Coordination',
    description:
      'Invite shop managers, ironers, and delivery riders with role-based access control to streamline shop workflows.',
    icon: Users,
  },
  {
    title: 'Direct Payouts & Earnings View',
    description:
      'Real-time financial dashboard tracking daily sales, settled balances, and automated payouts directly to your business bank or MoMo account.',
    icon: BarChart3,
  },
  {
    title: 'Verified Quality Reputation',
    description:
      'Earn genuine customer reviews, building local search authority and customer trust through verified transaction feedback.',
    icon: ShieldCheck,
  },
]

export default function ForLaundriesPage() {
  const badgeEmbedCode = `<a href="https://simame.tech/for-laundries" target="_blank" rel="noopener" title="Book us on Simame Laundry App">
  <img src="https://simame.tech/images/SIMAME_BRAND_LOGO-01.png" alt="Book on Simame" width="160" height="48" style="border-radius: 8px; border: 1px solid #0f766e;" />
</a>`

  return (
    <PublicPageShell
      eyebrow="For Laundries"
      path="/for-laundries"
      title="The Operating Platform for Ghanaian Laundry Businesses."
      description="Simame empowers local laundry and dry cleaning businesses with professional order tools, customer discovery, transparent payments, and digital booking links for their websites and social profiles."
      ctaHref="/auth/register"
      ctaLabel="Register Your Laundry"
    >
      {/* Platform Capabilities */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => {
          const Icon = capability.icon
          return (
            <article key={capability.title} className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-bold">{capability.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
            </article>
          )
        })}
      </div>

      {/* Partner Backlink & Badge Program */}
      <section className="mt-16 rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Partner Link &amp; Badge Program</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Official Partner Program</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Do you maintain a company website, Instagram bio, Facebook page, or Google Business profile? When you add our official &quot;Book us on Simame&quot; partner link or badge, your customers can instantly book pickup and delivery directly through our verified ordering platform.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Badge Preview */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold">Official Partner Badge Preview</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Embed this badge on your website footer, booking page, or sidebar:
            </p>

            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-muted/20 p-8 text-center">
              <div className="inline-flex items-center gap-3 rounded-xl border border-primary/40 bg-card px-5 py-3 shadow-md">
                <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-foreground">Book on Simame</span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Partner</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Official verified badge for partner websites (clean, lightweight, mobile-responsive).
              </p>
            </div>
          </div>

          {/* Embed Code Snippet */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Website Embed Code</h3>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Code2 className="h-3.5 w-3.5" /> HTML Snippet
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Copy and paste this snippet directly into your website&apos;s HTML:
            </p>

            <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono text-foreground">
              {badgeEmbedCode}
            </pre>

            <div className="mt-5 space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Where to link for best booking conversion:</p>
              <ul className="list-inside list-disc space-y-1">
                <li><strong>Instagram / TikTok:</strong> Put <code>simame.tech/for-laundries</code> or your custom slug in your bio.</li>
                <li><strong>Google Business Profile:</strong> Add as your secondary &quot;Appointment / Booking URL&quot;.</li>
                <li><strong>Website Header / Footer:</strong> Place a &quot;Order Online via Simame&quot; button.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Anti-Spam / Quality Notice */}
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            <strong>Quality &amp; Safety Standards:</strong> Partner links must serve real customers navigating to active, verified laundry businesses. Simame does not participate in reciprocal link schemes, private blog networks (PBNs), or paid backlink manipulation.
          </p>
        </div>
      </section>
    </PublicPageShell>
  )
}