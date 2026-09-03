'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'
import { Button } from '@/shared/ui/button'
import type { LegalLayoutProps } from '../types'
import { LEGAL_NAV_LINKS, DEFAULT_LEGAL_LAST_UPDATED } from '../constants'

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  children,
  title,
  subtitle,
  lastUpdated = DEFAULT_LEGAL_LAST_UPDATED,
}) => {
  const pathname = usePathname()

  const isCurrentRoute = (href: string) => {
    if (href === '/privacy' && (pathname === '/privacy' || pathname === '/privacy-policy')) return true
    if (href === '/terms' && (pathname === '/terms' || pathname === '/terms-of-service')) return true
    if (href === '/account-deletion' && (pathname === '/account-deletion' || pathname === '/delete-account')) return true
    return pathname === href
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <SimameLogo variant="lockup" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/30 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Legal & Compliance Information
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground pt-2">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border/50">
          {LEGAL_NAV_LINKS.map((item) => {
            const Icon = item.icon
            const active = isCurrentRoute(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? 'default' : 'outline'}
                  size="sm"
                  className={`gap-2 rounded-full font-medium transition-all ${
                    active ? 'shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </main>

      <footer className="bg-muted/40 border-t border-border/50 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SIMAME / CONNECT Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="text-border">•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span className="text-border">•</span>
            <Link href="/account-deletion" className="hover:text-foreground transition-colors">Account Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
