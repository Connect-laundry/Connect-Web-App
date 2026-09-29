import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'
import { StructuredData } from '@/shared/components/StructuredData'
import { SITE_URL, absoluteUrl } from '@/shared/lib/seo'

interface PublicPageShellProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  ctaHref?: string
  ctaLabel?: string
  path?: string
  parent?: { label: string; path: string }
  breadcrumbLabel?: string
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
  ctaHref = '/auth/register',
  ctaLabel = 'Get started',
  path,
  parent,
  breadcrumbLabel = eyebrow,
}: PublicPageShellProps) {
  const trail = [
    { name: 'Home', item: SITE_URL },
    ...(parent ? [{ name: parent.label, item: absoluteUrl(parent.path) }] : []),
    ...(path ? [{ name: breadcrumbLabel, item: absoluteUrl(path) }] : []),
  ]
  const breadcrumbSchema = path
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      }
    : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      <main className="min-h-screen bg-background">
        <header className="border-b border-border/60 bg-background/95">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="Simame home">
              <SimameLogo variant="lockup" />
            </Link>
            <Button asChild>
              <Link href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            {parent && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={parent.path} className="hover:text-foreground transition-colors">
                  {parent.label}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{breadcrumbLabel}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{description}</p>
          </div>
          {children}
        </section>
      </main>
    </>
  )
}