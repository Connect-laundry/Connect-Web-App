'use client'

import { useAuth } from '@/features/auth/context/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import {
  WashingMachine,
  Sparkles,
  Truck,
  Clock,
  Shield,
  Star,
  ChevronRight,
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

// ─── Floating Particles (Decorative) ────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/5 animate-float"
          style={{
            width: `${30 + i * 20}px`,
            height: `${30 + i * 20}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + i * 1.5}s`,
          }}
        />
      ))}
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
            <span className="text-xl font-bold tracking-tight">
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse delay-1000" />
      </div>
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-8">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Professional Laundry Services
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Fresh, Clean &{' '}
                <span className="bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Delivered
                </span>{' '}
                to Your Door
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300}>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Connect Laundry offers premium laundry and dry cleaning services with free pickup and delivery.
                Let us handle the dirty work while you focus on what matters.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={450}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" asChild className="h-13 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-13 px-8 text-base font-medium group">
                  <a href="#services">
                    View Services
                    <ChevronRight className="ml-1.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={600}>
              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span><strong>1,000+</strong> Happy Customers</span>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right - Hero Image */}
          <AnimateOnScroll animation="fade-left" delay={300} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <Image
                  src="/placeholder.svg"
                  alt="Professional laundry service - neatly folded clothes"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                  unoptimized
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-background/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/50 animate-bounce-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Free Pickup</p>
                    <p className="text-xs text-muted-foreground">At your doorstep</p>
                  </div>
                </div>
              </div>
              {/* Top right badge */}
              <div className="absolute -top-3 -right-3 bg-background/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">24hr Turnaround</span>
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
    description: 'Your everyday laundry, washed, dried, and neatly folded. Fresh clothes without the hassle.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/30',
  },
  {
    icon: Sparkles,
    title: 'Dry Cleaning',
    description: 'Professional dry cleaning for your delicate fabrics, suits, dresses, and special garments.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/30',
  },
  {
    icon: Truck,
    title: 'Free Pickup & Delivery',
    description: 'We come to you! Schedule a pickup and we\'ll deliver your clean clothes right back to your door.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'hover:border-green-500/30',
  },
  {
    icon: Zap,
    title: 'Express Service',
    description: 'Need it fast? Our express service ensures your laundry is done in as little as 6 hours.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'hover:border-amber-500/30',
  },
]

function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <FloatingParticles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Services Tailored for You
          </h2>
          <p className="text-muted-foreground text-lg">
            From everyday laundry to specialty garment care, we&apos;ve got every fabric covered.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <AnimateOnScroll key={service.title} animation="fade-up" delay={i * 120}>
              <Card className={`group border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm ${service.border} h-full`}>
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${service.bg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
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
    <section id="how-it-works" className="py-24 sm:py-32 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Getting your laundry done has never been easier. Just three simple steps.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, i) => (
            <AnimateOnScroll key={item.step} animation="fade-up" delay={i * 200}>
              <div className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-linear-to-r from-primary/30 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-105 relative">
                  <item.icon className="h-10 w-10 text-primary transition-transform duration-500 group-hover:rotate-12" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Featured Image */}
        <AnimateOnScroll animation="zoom-in" delay={400} className="mt-16">
          <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border/50">
            <Image
              src="/placeholder.svg"
              alt="Laundry delivery service"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Free Doorstep Delivery</p>
                  <p className="text-sm text-muted-foreground">We pick up and deliver at no extra cost</p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
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
    <section id="why-us" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl scale-95" />
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <Image
                  src="/placeholder.svg"
                  alt="Professional dry cleaning service"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>
              {/* Stats badge */}
              <div className="absolute -bottom-4 -right-4 bg-background/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">4.9/5</p>
                    <p className="text-xs text-muted-foreground">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right - Content */}
          <div>
            <AnimateOnScroll animation="fade-left">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why Connect Laundry</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                We Don&apos;t Just Clean Clothes.{' '}
                <span className="text-primary">We Care for Them.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                With years of experience and thousands of happy customers, Connect Laundry brings
                professional-grade cleaning to your doorstep with unmatched convenience.
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {reasons.map((reason, i) => (
                <AnimateOnScroll key={reason.title} animation="fade-up" delay={i * 100}>
                  <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 hover:bg-muted/60 transition-all duration-500 group hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <reason.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll animation="fade-up" delay={400}>
              <Button size="lg" asChild className="h-12 px-6 font-semibold group">
                <Link href="/auth/register">
                  Join Connect Laundry
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="zoom-in">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/80 p-10 sm:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-700" />
            
            {/* Animated dots - Client side only to avoid hydration mismatch */}
            {mounted && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/10 animate-float"
                    style={{
                      left: `${(i * 7) % 100}%`,
                      top: `${(i * 13) % 100}%`,
                      animationDelay: `${(i * 0.5) % 5}s`,
                      animationDuration: `${5 + (i % 5)}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight">
                Ready to Experience Premium Laundry?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Join thousands of satisfied customers. Your first pickup is on us!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button size="lg" variant="secondary" asChild className="h-13 px-8 text-base font-semibold shadow-lg group">
                  <Link href="/auth/register">
                    Start Today — It&apos;s Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild className="h-13 px-8 text-base font-medium text-primary-foreground hover:bg-white/10">
                  <Link href="/auth/login">Already a member? Log In</Link>
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
            <p>&copy; {new Date().getFullYear()} Connect Laundry. All rights reserved.</p>
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
export default function HomePage() {
  return (
    <main className="min-h-screen">
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
