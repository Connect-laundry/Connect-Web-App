import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { PublicPageShell } from '@/shared/components/PublicPageShell'
import { StructuredData } from '@/shared/components/StructuredData'
import { AppDownloadCallout } from '@/shared/components/AppDownloadCallout'
import { GooglePlayBadge } from '@/shared/components/GooglePlayBadge'
import { SpellingHelp } from '@/shared/components/SpellingHelp'
import {
  APP_ID,
  APP_NAME,
  GOOGLE_PLAY_PACKAGE_NAME,
  GOOGLE_PLAY_URL,
  ORGANIZATION_ID,
  absoluteUrl,
  publicPageMetadata,
} from '@/shared/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Connect Laundry App is now Simame - Laundry Connect | Download',
  description:
    'Looking for the Connect Laundry app? Connect Laundry is now Simame - Laundry Connect, the laundry pickup, delivery and dry cleaning app for Ghana. Download it free on Google Play.',
  path: '/connect-laundry',
})

const names = [
  ['Connect Laundry', 'The original project name that Simame was built and piloted under.'],
  ['Laundry Connect / Laundry Connect Ghana', 'The descriptor that stayed with the brand.'],
  ['Simame - Laundry Connect', 'The app name on Google Play today.'],
  ['Simame', 'The official brand, spelled S-I-M-A-M-E, at simame.tech and @simameapp.'],
]

const features = [
  'Find partner laundries near your location',
  'Book laundry pickup and delivery',
  'Choose wash and fold, dry cleaning or ironing',
  'See prices before you order',
  'Pay with Mobile Money or card',
  'Track your order from collection to delivery',
]

const faqs = [
  {
    question: 'Is Connect Laundry the same as Simame?',
    answer:
      'Yes. Connect Laundry was the founding project name of Simame. As the product and its laundry partner network grew, it took on one official brand, Simame, with Laundry Connect kept as its descriptor. The Google Play package ID is still com.connectlaundry.app.',
  },
  {
    question: 'Where do I download the Connect Laundry app?',
    answer: `Download Simame - Laundry Connect from Google Play at ${GOOGLE_PLAY_URL}. It is the same app, published under package ${GOOGLE_PLAY_PACKAGE_NAME}.`,
  },
  {
    question: 'Is the Connect Laundry app available on iPhone?',
    answer:
      'Not yet. Simame - Laundry Connect is currently available for Android on Google Play. Follow @simameapp for news about an iPhone version.',
  },
  {
    question: 'I run a laundry. Can I still join?',
    answer:
      'Yes. Laundry businesses sign up and manage orders, prices, opening hours and staff on the web at simame.tech. See the For Laundries page to get started.',
  },
]

export default function ConnectLaundryPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl('/connect-laundry')}#webpage`,
    url: absoluteUrl('/connect-laundry'),
    name: 'Connect Laundry is now Simame',
    about: [{ '@id': ORGANIZATION_ID }, { '@id': APP_ID }],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <StructuredData data={pageSchema} />
      <StructuredData data={faqSchema} />
      <PublicPageShell
        eyebrow="Connect Laundry"
        path="/connect-laundry"
        title="Connect Laundry is now Simame."
        description="If you are looking for the Connect Laundry app, you are in the right place. Connect Laundry grew into Simame - Laundry Connect, the laundry app for Ghana. Same app, same Google Play listing, one official name."
        ctaHref="/app"
        ctaLabel="Get the app"
      >
        <section className="mt-10 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{APP_NAME}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Android · Free · Google Play package <code>{GOOGLE_PLAY_PACKAGE_NAME}</code>
              </p>
            </div>
            <GooglePlayBadge />
          </div>
        </section>

        <section className="mt-12" aria-labelledby="names-heading">
          <h2 id="names-heading" className="text-2xl font-bold tracking-tight">
            One brand, a few names
          </h2>
          <p className="mt-2 text-muted-foreground">You may have heard of us under any of these names. They all mean the same company and app.</p>
          <dl className="mt-6 divide-y divide-border rounded-lg border bg-card">
            {names.map(([name, meaning]) => (
              <div key={name} className="grid gap-1 px-6 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
                <dt className="font-semibold">{name}</dt>
                <dd className="text-sm leading-6 text-muted-foreground">{meaning}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            Other apps and laundries with similar-sounding names are separate businesses and are not connected to Simame.
          </p>
        </section>

        <SpellingHelp variant="card" />

        <section className="mt-12" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-bold tracking-tight">
            What you can do in the app
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Read more <Link href="/about" className="font-medium text-primary hover:underline">about Simame</Link> or see{' '}
            <Link href="/how-it-works" className="font-medium text-primary hover:underline">how it works</Link>.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="connect-faq-heading">
          <h2 id="connect-faq-heading" className="text-2xl font-bold tracking-tight">
            Questions about Connect Laundry
          </h2>
          <div className="mt-4 divide-y divide-border rounded-lg border bg-card shadow-sm">
            {faqs.map((faq) => (
              <div key={faq.question} className="px-6 py-5">
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AppDownloadCallout heading="Download Simame - Laundry Connect" />
      </PublicPageShell>
    </>
  )
}
