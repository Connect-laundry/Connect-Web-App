'use client'

import { useAuth } from '@/features/auth/context/AuthContext'
import Link from 'next/link'
import {
  WashingMachine,
  Sparkles,
  Truck,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Zap,
  Heart,
  Menu,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { HeroPhoto } from '@/features/marketing/components/HeroPhoto'
import { DeliveryShowcase } from '@/features/marketing/components/DeliveryShowcase'
import { marketingImages } from '@/features/marketing/constants/images'
import { SectionLabel } from '@/features/marketing/components/SectionLabel'
import { TrustPills } from '@/features/marketing/components/TrustPills'
import { PickupBar } from '@/features/marketing/components/PickupBar'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { useState, useEffect, useRef, type ReactNode } from 'react'

// ─── Scroll Animation Component ────────────────────────
function AnimateOnScroll({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 700,
}: {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade'
  delay?: number
  duration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [])

  const transforms: Record<string, string> = {
    'fade-up': 'translateY(40px)',
    'fade-down': 'translateY(-40px)',
    'fade-left': 'translateX(40px)',
    'fade-right': 'translateX(-40px)',
    'zoom-in': 'scale(0.9)',
    'fade': 'none',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : transforms[animation],
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Navbar ─────────────────────────────────────────────
function Navbar() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-105">
              <WashingMachine className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Connect<span className="text-primary"> Laundry</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild className="group">
                <Link href="/dashboard">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-sm font-medium">
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild className="text-sm font-semibold group">
                  <Link href="/auth/register">
                    Get Started <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border/50 space-y-2">
              {isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/login">Log In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ───────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20 landing-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-8">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <SectionLabel>Laundry & dry cleaning</SectionLabel>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-foreground">
                We&apos;ll take the laundry.{' '}
                <span className="text-primary">You take the time.</span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={200}>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-medium">
                Connect picks up, cleans, and delivers — with local partners you can trust and an owner
                dashboard to run your shop.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <PickupBar />
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={400}>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" asChild className="h-12 px-7 font-bold rounded-xl shadow-glow-sm">
                  <Link href="/auth/register">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-7 font-semibold rounded-xl border-primary/25">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={500}>
              <TrustPills />
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-left" delay={200} className="relative pb-8 sm:pb-0">
            <HeroPhoto />
            <div className="absolute bottom-0 left-2 sm:left-4 max-w-[200px] rounded-2xl border border-border/60 bg-card p-4 shadow-xl hidden sm:block z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">24h turnaround</p>
                  <p className="text-xs text-muted-foreground">Standard service</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}

// ─── Services ───────────────────────────────────────────
const services = [
  {
    icon: WashingMachine,
    title: 'Wash & Fold',
    description: 'Everyday laundry washed, dried, and folded — ready for your drawer.',
    tone: 'primary' as const,
  },
  {
    icon: Sparkles,
    title: 'Dry Cleaning',
    description: 'Care labels followed. Suits, dresses, and delicates handled by pros.',
    tone: 'accent' as const,
  },
  {
    icon: Truck,
    title: 'Pickup & Delivery',
    description: 'Schedule once. We collect and return to your door at no extra hassle.',
    tone: 'primary' as const,
  },
  {
    icon: Zap,
    title: 'Express',
    description: 'Tight deadline? Rush options when your local partner supports it.',
    tone: 'accent' as const,
  },
]

function Services() {
  return (
    <section id="services" className="py-24 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>What we offer</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Wash & fold, dry cleaning, and more
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            One platform for customers and owners — same quality, end to end.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <AnimateOnScroll key={service.title} animation="fade-up" delay={i * 100}>
              <Card className="group surface-card border-0 h-full hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${
                      service.tone === 'primary'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-accent/15 text-accent border-accent/25'
                    }`}
                  >
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ───────────────────────────────────────
const steps = [
  {
    step: '01',
    title: 'Schedule a Pickup',
    description: 'Book a pickup online or call us. Choose a time that works for you and we\'ll be there.',
    icon: Phone,
  },
  {
    step: '02',
    title: 'We Clean & Care',
    description: 'Our experts sort, wash, dry, and fold your clothes with premium detergents and care.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Delivered Fresh',
    description: 'Your freshly cleaned clothes are delivered right to your doorstep, neatly packaged.',
    icon: Truck,
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" className="text-center max-w-2xl mx-auto mb-10">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Three steps. Zero laundry stress.
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Schedule online — we handle pickup, cleaning, and delivery.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100} className="mb-12 max-w-4xl mx-auto">
          <DeliveryShowcase />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <AnimateOnScroll key={item.step} animation="fade-up" delay={i * 150}>
              <div className="text-center p-6 rounded-2xl surface-card border-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-black mb-5">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us ──────────────────────────────────────
const reasons = [
  {
    icon: Shield,
    title: 'Trusted Quality',
    description: 'We use premium, eco-friendly detergents and advanced cleaning techniques to protect your garments.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Standard 24-hour turnaround with express options available for same-day service.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We offer a 100% happiness guarantee on every order.',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Pricing',
    description: 'No hidden fees. Know exactly what you\'ll pay before you book. Simple, honest pricing.',
  },
]

function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <AnimateOnScroll animation="fade-right">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 rounded-2xl overflow-hidden shadow-lg ring-1 ring-border/40">
                <Image
                  src={marketingImages.doorstepPickup}
                  alt="Laundry bags ready for pickup at your door"
                  width={800}
                  height={480}
                  className="w-full h-52 object-cover"
                  unoptimized
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md ring-1 ring-border/40">
                <Image
                  src={marketingImages.qualityGarments}
                  alt="Professionally pressed garments"
                  width={400}
                  height={280}
                  className="w-full h-40 object-cover"
                  unoptimized
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md ring-1 ring-border/40">
                <Image
                  src={marketingImages.heroLaundryDetail}
                  alt="Fresh folded laundry"
                  width={400}
                  height={280}
                  className="w-full h-40 object-cover"
                  unoptimized
                />
              </div>
            </div>
          </AnimateOnScroll>

          <div>
            <AnimateOnScroll animation="fade-left">
              <SectionLabel>Why Connect</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
                Built for customers.{' '}
                <span className="text-primary">Powered for owners.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">
                Local laundries get a real dashboard to manage orders and revenue. Customers get
                pickup, pro cleaning, and delivery — one connected experience.
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {reasons.map((reason, i) => (
                <AnimateOnScroll key={reason.title} animation="fade-up" delay={i * 80}>
                  <div className="p-5 rounded-2xl surface-card border-0 hover:border-primary/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <reason.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold mb-1.5">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <Button size="lg" asChild className="h-12 px-7 font-bold rounded-xl shadow-glow-sm">
                <Link href="/auth/register">
                  Create your account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ─────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="zoom-in">
          <div className="relative overflow-hidden rounded-3xl landing-cta-panel p-10 sm:p-14 text-center">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent/20 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-primary-foreground tracking-tight">
                Ready for laundry that fits your week?
              </h2>
              <p className="text-primary-foreground/85 text-lg font-medium">
                Sign up in minutes. Schedule your first pickup when you&apos;re ready.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="h-12 px-8 text-base font-bold rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
                >
                  <Link href="/auth/register">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 px-8 text-base font-semibold rounded-xl border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-white/10"
                >
                  <Link href="/auth/login">Log in</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

// ─── Footer ─────────────────────────────────────────────
function Footer() {
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
                <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Get Started</Link></li>
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

// ─── Main Page ──────────────────────────────────────────
export function LandingPage() {
  return (
    <main className="min-h-screen font-sans antialiased">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <CTABanner />
      <Footer />
    </main>
  )
}
