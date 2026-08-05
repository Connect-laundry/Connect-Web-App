'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, WashingMachine, X } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/shared/ui/button'
import { navigationLinks } from '../data/landingContent'

export function MarketingNavbar() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-105">
              <WashingMachine className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-black tracking-tight">Connect<span className="text-primary"> Laundry</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <a key={link.label} href={link.href} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 relative group">
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild className="group"><Link href="/dashboard">Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-sm font-medium"><Link href="/auth/login">Log In</Link></Button>
                <Button asChild className="text-sm font-semibold group"><Link href="/auth/register">Get Started <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1">
            {navigationLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">{link.label}</a>
            ))}
            <div className="pt-3 border-t border-border/50 space-y-2">
              {isAuthenticated ? (
                <Button asChild className="w-full"><Link href="/dashboard">Dashboard</Link></Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full"><Link href="/auth/login">Log In</Link></Button>
                  <Button asChild className="w-full"><Link href="/auth/register">Get Started</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
