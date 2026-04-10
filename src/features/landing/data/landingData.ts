import {
  WashingMachine,
  Sparkles,
  Truck,
  Zap,
  Phone,
  Shield,
  Clock,
  Heart,
  CheckCircle2,
} from 'lucide-react'
import type { ComponentType } from 'react'

export interface NavLink {
  label: string
  href: string
}

export interface ServiceItem {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  bg: string
  border: string
}

export interface ProcessStep {
  step: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
}

export interface ReasonItem {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
]

export const SERVICES: ServiceItem[] = [
  {
    icon: WashingMachine,
    title: 'Wash & Fold',
    description:
      'Your everyday laundry, washed, dried, and neatly folded. Fresh clothes without the hassle.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/30',
  },
  {
    icon: Sparkles,
    title: 'Dry Cleaning',
    description:
      'Professional dry cleaning for your delicate fabrics, suits, dresses, and special garments.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/30',
  },
  {
    icon: Truck,
    title: 'Free Pickup & Delivery',
    description:
      "We come to you! Schedule a pickup and we'll deliver your clean clothes right back to your door.",
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'hover:border-green-500/30',
  },
  {
    icon: Zap,
    title: 'Express Service',
    description:
      'Need it fast? Our express service ensures your laundry is done in as little as 6 hours.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'hover:border-amber-500/30',
  },
]

export const HOW_IT_WORKS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Schedule a Pickup',
    description:
      "Book a pickup online or call us. Choose a time that works for you and we'll be there.",
    icon: Phone,
  },
  {
    step: '02',
    title: 'We Clean & Care',
    description:
      'Our experts sort, wash, dry, and fold your clothes with premium detergents and care.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Delivered Fresh',
    description:
      'Your freshly cleaned clothes are delivered right to your doorstep, neatly packaged.',
    icon: Truck,
  },
]

export const WHY_CHOOSE_US_REASONS: ReasonItem[] = [
  {
    icon: Shield,
    title: 'Trusted Quality',
    description:
      'We use premium, eco-friendly detergents and advanced cleaning techniques to protect your garments.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description:
      'Standard 24-hour turnaround with express options available for same-day service.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description:
      'Your satisfaction is our priority. We offer a 100% happiness guarantee on every order.',
  },
  {
    icon: CheckCircle2,
    title: 'Transparent Pricing',
    description:
      "No hidden fees. Know exactly what you'll pay before you book. Simple, honest pricing.",
  },
]
