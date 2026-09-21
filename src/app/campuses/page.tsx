import type { Metadata } from 'next'
import { GraduationCap, MapPinned, ShieldCheck } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Campus Laundry with Simame',
  description:
    'Simame supports a careful campus laundry strategy for Ghanaian universities and students without publishing campus pages before real availability is confirmed.',
  path: '/campuses',
})

const rules = [
  { title: 'Student value first', description: 'Campus content should help students understand pickup, delivery, timing, garment care, and booking choices.', icon: GraduationCap },
  { title: 'No false affiliation', description: 'Simame should not imply official university affiliation unless a formal relationship exists.', icon: ShieldCheck },
  { title: 'Coverage before indexing', description: 'A campus page needs nearby active providers, real availability, and unique information before it enters the sitemap.', icon: MapPinned },
]

export default function CampusesPage() {
  return (
    <PublicPageShell
      eyebrow="Campus Laundry"
      path="/campuses"
      title="A careful campus laundry strategy for Ghana."
      description="Simame can serve students and university communities without turning every campus name into a thin SEO page. KNUST and other campuses should become dedicated pages only after founder-approved history and service availability are verified."
    >
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {rules.map((rule) => {
          const Icon = rule.icon
          return (
            <article key={rule.title} className="rounded-lg border bg-card p-6 shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 text-lg font-bold">{rule.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{rule.description}</p>
            </article>
          )
        })}
      </div>
    </PublicPageShell>
  )
}