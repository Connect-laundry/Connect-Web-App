'use client'

import Link from 'next/link'
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { useAuth } from '@/features/auth/context/AuthContext'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'
import { VERIFIED_SOCIAL_PROFILES } from '@/shared/lib/social'

export const Footer = () => {
  const { isAuthenticated } = useAuth()

  return (
    <footer id="contact" className="bg-muted/40 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimateOnScroll animation="fade-up" delay={0} className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <SimameLogo variant="lockup" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Laundry pickup, delivery, wash and fold, dry cleaning, ironing, and garment care in supported Ghana service areas.
              </p>
              <div className="flex flex-wrap gap-3">
                {VERIFIED_SOCIAL_PROFILES.map((profile) => (
                  <a
                    key={profile.platform}
                    href={profile.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Follow Simame on ${profile.platform}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/services" className="hover:text-foreground transition-colors">Laundry Services</Link></li>
                <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link href="/locations" className="hover:text-foreground transition-colors">Locations</Link></li>
                <li><Link href="/for-laundries" className="hover:text-foreground transition-colors">For Laundries</Link></li>
                <li><Link href={isAuthenticated ? '/dashboard' : '/auth/register'} className="hover:text-foreground transition-colors">{isAuthenticated ? 'Dashboard' : 'Get Started'}</Link></li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Simame</Link></li>
                <li><Link href="/app" className="hover:text-foreground transition-colors">Simame App</Link></li>
                <li><Link href="/campuses" className="hover:text-foreground transition-colors">Campus Laundry</Link></li>
                <li><Link href="/technology" className="hover:text-foreground transition-colors">Technology</Link></li>
                <li><Link href="/press" className="hover:text-foreground transition-colors">Press</Link></li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-primary mt-0.5" />
                  <span>+233 20 090 9897 / +233 55 105 7139</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:info@simame.tech" className="hover:text-foreground transition-colors">info@simame.tech</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  Ghana
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade">
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SIMAME. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/account-deletion" className="hover:text-foreground transition-colors">Account Deletion</Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </footer>
  )
}