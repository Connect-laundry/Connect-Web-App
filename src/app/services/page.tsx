import type { Metadata } from 'next'
import {
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
  Wand2,
} from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { publicPageMetadata } from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Laundry Services on Simame - Pickup, Delivery & Garment Care in Ghana',
  description:
    'Explore comprehensive laundry services on Simame: wash and fold, dry cleaning, ironing, express turnaround, and campus pickup in Ghana with verified laundry partners.',
  path: '/services',
})

const serviceOfferings = [
  {
    title: 'Laundry Pickup & Delivery',
    subtitle: 'Scheduled doorstep collection and return',
    description:
      'Avoid trips to the laundromat. Schedule a collection time window from your home, office, or hostel. Verified local drivers collect your tagged laundry bag and return freshly cared-for garments when completed.',
    icon: Truck,
    highlights: [
      'Live driver status updates and collection time windows',
      'Tamper-evident bag tagging and inventory logging',
      'Doorstep delivery back to your address or reception',
      'Coverage zone determined by partner laundry location',
    ],
  },
  {
    title: 'Wash and Fold (Everyday Laundry)',
    subtitle: 'Washed, dried, and crisply folded garments',
    description:
      'Ideal for everyday wear, casual shirts, t-shirts, shorts, gym wear, towels, and bed linens. Garments are carefully washed using quality detergents, tumbled dry, and folded cleanly for direct wardrobe storage.',
    icon: Shirt,
    highlights: [
      'Automatic dark and light garment separation',
      'Gentle fabric conditioning and temperature control',
      'Available by weight (kg) or per-item pricing models',
      'Folded neatly and packaged for dust protection',
    ],
  },
  {
    title: 'Professional Dry Cleaning',
    subtitle: 'Specialist care for delicate and formal fabrics',
    description:
      'High-grade solvent cleaning that gently lifts oils, stains, and odors without moisture damage. Essential for two-piece suits, blazers, evening gowns, wedding attire, traditional Ghanaian Kente, and fine silks.',
    icon: Sparkles,
    highlights: [
      'Pre-spotting and individualized stain assessment',
      'Safe for wool, silk, linen, cashmere, and ceremonial fabrics',
      'Gentle on buttons, embroidery, and sensitive trims',
      'Returned on hangers with protective garment covers',
    ],
  },
  {
    title: 'Ironing & Steam Pressing',
    subtitle: 'Crisp, wrinkle-free business and formal wear',
    description:
      'Keep your work shirts, trousers, office uniforms, and event dresses pristine with commercial steam pressing. Removes deep creases while preserving delicate seams and fabric structure.',
    icon: Wand2,
    highlights: [
      'Adjustable steam temperature for cottons, polyesters, and blends',
      'Hand-finished collars, cuffs, and sharp pleats',
      'Choice of folded or hung presentation',
      'Available standalone or paired with wash services',
    ],
  },
  {
    title: 'Campus & Student Laundry',
    subtitle: 'Tailored turnaround for university students',
    description:
      'Specifically organized for students at universities including KNUST and surrounding hostels. Budget-conscious pricing, scheduled hostel pickup points, and quick weekend turnaround so students can focus on studies.',
    icon: GraduationCap,
    highlights: [
      'Designated hostel pickup and meeting points',
      'Clear student-friendly turnaround times',
      'Simple digital tracking on the mobile web app',
      'Support for dorm bedding, lab coats, and weekly clothes',
    ],
  },
  {
    title: 'Specialty & Household Textiles',
    subtitle: 'Bulky items, curtains, and heavy bedding',
    description:
      'Commercial-capacity cleaning for heavy duvets, comforters, bedspreads, drapes, and curtains that exceed standard household washing machine limits.',
    icon: ShieldCheck,
    highlights: [
      'Deep cleaning to remove dust mites and allergens',
      'Thorough drying to prevent odor and mildew',
      'Sanitized and packed in breathable storage bags',
      'Transparent flat-rate pricing per household item',
    ],
  },
]

const serviceFaqs = [
  {
    question: 'How does laundry pickup and delivery work on Simame?',
    answer:
      'When ordering through Simame, select your address or hostel, choose the services required (wash & fold, dry cleaning, ironing), and pick an available collection window. A driver collects your items, the laundry partner inspects and processes them, and your clean clothes are delivered back to your address.',
  },
  {
    question: 'How is laundry priced on Simame?',
    answer:
      'Pricing depends on the service model offered by each local laundry partner. Everyday wash & fold is commonly priced per kilogram (kg) or per bag, while formal wear, dry cleaning, and heavy items like duvets and suits are priced per item. Delivery fees are calculated transparently based on distance.',
  },
  {
    question: 'What is the standard turnaround time for laundry?',
    answer:
      'Standard turnaround time is typically 24 to 48 hours for wash & fold and everyday garments. Dry cleaning and delicate specialty garments may require 48 to 72 hours for careful treatment. Same-day or express turnaround is subject to partner capacity and location.',
  },
  {
    question: 'Can I dry clean traditional Ghanaian fabrics like Kente or Northern smocks?',
    answer:
      'Yes. Our partner dry cleaners handle delicate woven fabrics, including traditional Kente, ceremonial wear, and hand-embroidered garments, using specialized dry cleaning techniques that protect colors and hand-woven threads.',
  },
  {
    question: 'How are my clothes kept safe and accounted for?',
    answer:
      'Every order is assigned a unique order identifier. Garments are counted and inspected upon arrival at the partner facility. Customers receive digital status updates at each stage: Collected, Processing, Ready, and Out for Delivery.',
  },
  {
    question: 'How do I pay for my laundry order?',
    answer:
      'Simame supports secure cashless payments, including Mobile Money (MTN MoMo, Telecel Cash, AT Money) and debit/credit cards via Paystack, ensuring funds are handled safely and transparently.',
  },
]

export default function ServicesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: serviceFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <PublicPageShell
      eyebrow="Laundry Services"
      path="/services"
      title="Complete Laundry & Garment Care Solutions in Ghana."
      description="Simame connects customers, busy professionals, students, and businesses with verified local laundry and dry cleaning partners. Explore our core services, turnaround standards, and transparent workflow."
      ctaHref="/auth/register"
      ctaLabel="Schedule a Pickup"
    >
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Services Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {serviceOfferings.map((service) => {
          const Icon = service.icon
          return (
            <article
              key={service.title}
              className="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{service.title}</h2>
                  <p className="text-xs font-medium text-muted-foreground">{service.subtitle}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              <ul className="mt-5 space-y-2 border-t pt-4 text-xs text-muted-foreground">
                {service.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>

      {/* Trust & Operations Policy */}
      <section className="mt-16 rounded-xl border bg-muted/40 p-8">
        <h2 className="text-2xl font-bold tracking-tight">How Simame Partners Ensure Quality</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every laundry business participating in the Simame network is vetted for operating standards, hygiene, and equipment reliability.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold text-sm">Reliable Turnaround</h3>
              <p className="mt-1 text-xs text-muted-foreground">Clear delivery windows agreed before processing begins.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold text-sm">Garment Care Guarantee</h3>
              <p className="mt-1 text-xs text-muted-foreground">Care label adherence and professional item inspection.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold text-sm">Secure MoMo Payments</h3>
              <p className="mt-1 text-xs text-muted-foreground">Convenient, cashless checkout via mobile money and cards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQs */}
      <section className="mt-16">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Common questions about booking, garment handling, pricing, and coverage in Ghana.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {serviceFaqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">{faq.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicPageShell>
  )
}