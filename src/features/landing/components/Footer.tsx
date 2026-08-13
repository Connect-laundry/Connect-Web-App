'use client'

import Link from 'next/link'
import { WashingMachine, Phone, Mail, MapPin } from 'lucide-react'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { useAuth } from '@/features/auth/context/AuthContext'

export function Footer() {
  const { isAuthenticated } = useAuth()
  
  return (
    <footer id="contact" className="bg-muted/40 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimateOnScroll animation="fade-up" delay={0} className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <WashingMachine className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Connect<span className="text-primary"> Laundry</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional laundry and dry cleaning services with free pickup and delivery to your door.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-foreground transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#why-us" className="hover:text-foreground transition-colors">Why Choose Us</a></li>
                <li><Link href={isAuthenticated ? '/dashboard' : '/auth/register'} className="hover:text-foreground transition-colors">{isAuthenticated ? 'Dashboard' : 'Get Started'}</Link></li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Wash & Fold</li>
                <li>Dry Cleaning</li>
                <li>Express Service</li>
                <li>Free Delivery</li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  +233 XX XXX XXXX
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  info@connectlaundry.com
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  Accra, Ghana
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade">
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Simame. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </footer>
  )
}
