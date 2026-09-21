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
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Locations', href: '/locations' },
  { label: 'For Laundries', href: '/for-laundries' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const SERVICES: ServiceItem[] = [
  {
    icon: WashingMachine,
    title: 'Wash & Fold',
    description:
      'Everyday laundry washed, dried, and folded so clean clothes are ready without the extra errand.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/30',
  },
  {
    icon: Sparkles,
    title: 'Dry Cleaning',
    description:
      'Garment care for delicate fabrics, suits, dresses, and special items handled by laundry partners.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/30',
  },
  {
    icon: Truck,
    title: 'Laundry Pickup & Delivery',
    description:
      'Schedule pickup and delivery for laundry service in supported Ghana service areas.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'hover:border-green-500/30',
  },
  {
    icon: Zap,
    title: 'Express Options',
    description:
      'Rush turnaround options can be offered when a local laundry partner supports express service.',
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
      'Choose a pickup time and share the laundry service you need from a supported area.',
    icon: Phone,
  },
  {
    step: '02',
    title: 'Laundry Partner Handles Care',
    description:
      'A laundry partner receives the order details and manages washing, folding, ironing, or dry cleaning.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Track Delivery',
    description:
      'Follow the order workflow until clean garments are ready for delivery or completion.',
    icon: Truck,
  },
]

export const WHY_CHOOSE_US_REASONS: ReasonItem[] = [
  {
    icon: Shield,
    title: 'Clear Service Information',
    description:
      'Customers can see service details before booking instead of guessing what a laundry provider supports.',
  },
  {
    icon: Clock,
    title: 'Operational Visibility',
    description:
      'Laundry owners can track incoming orders, statuses, pricing, and staff assignments from one dashboard.',
  },
  {
    icon: Heart,
    title: 'Customer Support Access',
    description:
      'Public contact, privacy, terms, and account deletion information are available without signing in.',
  },
  {
    icon: CheckCircle2,
    title: 'Structured Partner Tools',
    description:
      'The owner app supports business profiles, hours, service pricing, notifications, earnings, and staff workflows.',
  },
]