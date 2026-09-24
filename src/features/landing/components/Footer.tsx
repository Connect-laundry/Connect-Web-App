'use client'

import Link from 'next/link'
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { useAuth } from '@/features/auth/context/AuthContext'
import { SimameLogo } from '@/shared/components/branding/SimameLogo'
import { VERIFIED_SOCIAL_PROFILES } from '@/shared/lib/social'

import { toast } from 'sonner'

export const Footer = () => {
  const { isAuthenticated } = useAuth()

  const handleStoreClick = (e: React.MouseEvent, storeName: string) => {
    e.preventDefault()
    toast.info(`Simame mobile app downloads are coming soon to ${storeName}!`)
  }

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
              <div className="flex flex-col gap-3 pt-4">
                <a
                  href="/app"
                  onClick={(e) => handleStoreClick(e, 'the App Store')}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-[140px] h-[44px]"
                >
                  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  <div className="text-left">
                    <div className="text-[8px] leading-tight">Download on the</div>
                    <div className="text-xs font-semibold leading-tight">App Store</div>
                  </div>
                </a>
                <a
                  href="/app"
                  onClick={(e) => handleStoreClick(e, 'Google Play')}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-[140px] h-[44px]"
                >
                  <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                  <div className="text-left">
                    <div className="text-[8px] leading-tight">GET IT ON</div>
                    <div className="text-xs font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
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