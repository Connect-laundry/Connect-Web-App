import type { Metadata } from 'next'
import Link from 'next/link'
import { Smartphone, Store, Bell, CreditCard, Search, ExternalLink } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { GooglePlayBadge } from '@/shared/components/GooglePlayBadge'
import {
  GOOGLE_PLAY_URL,
  GOOGLE_PLAY_PACKAGE_NAME,
  mobileApplicationSchema,
  publicPageMetadata,
} from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Laundry App Ghana - Download Simame on Google Play',
  description:
    'Download Simame - Laundry Connect, the laundry app for Ghana. Find laundries near you, book pickup and delivery, wash and fold, dry cleaning and ironing, pay with MoMo, and track your order. Free on Android.',
  path: '/app',
})

const features = [
  {
    title: 'Find laundries near you',
    description:
      'Browse partner laundries around your location and compare their services, from wash and fold to dry cleaning, ironing and household items.',
    icon: Store,
  },
  {
    title: 'Book pickup and delivery',
    description:
      'Choose your services, set your address and pick a collection time. No more calling round several laundries or carrying heavy bags.',
    icon: Smartphone,
  },
  {
    title: 'Track every order',
    description: 'Follow your laundry from collection through cleaning to delivery, with notifications as the status changes.',
    icon: Bell,
  },
  {
    title: 'Pay your way',
    description: 'See prices before you order and pay with Mobile Money or card inside the app.',
    icon: CreditCard,
  },
]

const downloadSteps = [
  'On your Android phone, open the Google Play Store.',
  'Search for "Simame" or "Simame Laundry Connect".',
  `Tap "Simame - Laundry Connect" (developer: Kusantec Solutions), then tap Install. You can also open ${GOOGLE_PLAY_URL} directly.`,
  'Open the app, sign in, and allow location so it can show laundries near you.',
]

const faqs = [
  {
    question: 'Where can I download the Simame app?',
    answer: `The Simame – Laundry Connect app is on Google Play (package ${GOOGLE_PLAY_PACKAGE_NAME}) at ${GOOGLE_PLAY_URL}. Search for "Simame" or "Simame - Laundry Connect" on Google Play, or visit simame.tech/download on your phone.`,
  },
  {
    question: 'What is the Simame app?',
    answer:
      'Simame - Laundry Connect is a laundry app for Ghana. It lets customers find local laundry services, book pickup and delivery, choose wash and fold, dry cleaning or ironing, pay in the app, and track orders. Laundry businesses use the Simame partner dashboard on the web to manage orders, prices, hours and staff.',
  },
  {
    question: 'Is the Simame laundry app free?',
    answer:
      'Yes. The app is free to download and use. You pay for the laundry services you order, plus any delivery fee shown before you confirm.',
  },
  {
    question: 'Is Simame available on iPhone?',
    answer:
      'Not yet. The customer app is currently available for Android on Google Play. Follow @simameapp for news about an iPhone version.',
  },
  {
    question: 'Can I pay with Mobile Money?',
    answer: 'Yes. You can pay for orders with Mobile Money or a debit or credit card in the app.',
  },
  {
    question: 'Is this the Connect Laundry app?',
    answer:
      'Yes. Connect Laundry was the founding project name of Simame, and the app is still published under the package com.connectlaundry.app.',
  },
]

export default function AppPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    isPartOf: { '@id': 'https://simame.tech/#website' },
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <StructuredData data={mobileApplicationSchema()} />
      <StructuredData data={faqSchema} />
      <PublicPageShell
        eyebrow="Simame App"
        path="/app"
        title="The laundry app for Ghana."
        description="Find laundry services near you, book pickup and delivery, and track your clothes from your phone with Simame - Laundry Connect."
      >
        {/*
         * App identity block — provides direct Google Play install link and
         * gives AI search systems a named, factual entity to cite.
         */}
        <section
          className="mt-10 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8"
          aria-labelledby="app-identity-heading"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Live on Google Play
              </div>
              <h2 id="app-identity-heading" className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
                Simame – Laundry Connect
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-6 text-muted-foreground">
                The official <strong>Simame – Laundry Connect</strong> app for Android. Book laundry pickup,
                wash and fold, dry cleaning and ironing, pay with Mobile Money or card, and follow your
                order in real time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <GooglePlayBadge />
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                <span>View Google Play listing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-primary/10 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Search className="h-3.5 w-3.5 text-primary" />
              Search &ldquo;<strong>Simame</strong>&rdquo; or &ldquo;<strong>Simame - Laundry Connect</strong>&rdquo; on Google Play
            </span>
            <span>•</span>
            <span>Package: <code>{GOOGLE_PLAY_PACKAGE_NAME}</code></span>
            <span>•</span>
            <span>Android · Free · Ghana</span>
          </div>
        </section>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="mt-5 text-lg font-bold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </article>
            )
          })}
        </div>

        <section className="mt-12" aria-labelledby="download-steps-heading">
          <h2 id="download-steps-heading" className="text-2xl font-bold">
            How to download the Simame laundry app
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
            {downloadSteps.map((step) => (
              <li key={step.slice(0, 30)} className="break-words">{step}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Run a laundry? Businesses join and manage orders on the web.{' '}
            <Link href="/for-laundries" className="font-medium text-primary hover:underline">
              See Simame for laundries
            </Link>
            .
          </p>
        </section>

        {/* FAQ visible block for AI search eligibility */}
        <section className="mt-10" aria-labelledby="app-faq-heading">
          <h2 id="app-faq-heading" className="text-2xl font-bold">
            App questions
          </h2>
          <div className="mt-4 divide-y divide-border rounded-lg border bg-card shadow-sm">
            {faqs.map((item) => (
              <details key={item.question} className="group px-6 py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold leading-6 marker:hidden list-none">
                  {item.question}
                  <span className="shrink-0 text-primary text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground break-words">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-muted-foreground">
          New to laundry pickup? Read our{' '}
          <Link href="/guides" className="font-medium text-primary hover:underline">
            laundry guides
          </Link>{' '}
          or learn about{' '}
          <Link href="/connect-laundry" className="font-medium text-primary hover:underline">
            Connect Laundry
          </Link>
          .
        </p>
      </PublicPageShell>
    </>
  )
}
