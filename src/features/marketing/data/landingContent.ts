import {
  CheckCircle2,
  Clock,
  Heart,
  Phone,
  Shield,
  Sparkles,
  Truck,
  WashingMachine,
  Zap,
} from 'lucide-react'

export const navigationLinks = [
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Locations', href: '/locations' },
  { label: 'Contact', href: '/contact' },
]

export const services = [
  {
    icon: WashingMachine,
    title: 'Wash & Fold',
    description: 'Everyday laundry washed, dried, and folded by participating laundry partners.',
    tone: 'primary' as const,
  },
  {
    icon: Sparkles,
    title: 'Dry Cleaning',
    description: 'Partner-supported care for suits, dresses, and delicate garments.',
    tone: 'accent' as const,
  },
  {
    icon: Truck,
    title: 'Pickup & Delivery',
    description: 'Schedule collection and return where local service coverage supports it.',
    tone: 'primary' as const,
  },
  {
    icon: Zap,
    title: 'Express Options',
    description: 'Rush turnaround can be offered when a local laundry partner supports it.',
    tone: 'accent' as const,
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Schedule a Pickup',
    description: 'Choose a pickup time and share the laundry service you need from a supported area.',
    icon: Phone,
  },
  {
    step: '02',
    title: 'Partner Care',
    description: 'A laundry partner receives the order details and handles the service workflow.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Delivery or Completion',
    description: 'Follow order status until the garments are ready for delivery or collection.',
    icon: Truck,
  },
]

export const reasons = [
  {
    icon: Shield,
    title: 'Clear Service Information',
    description: 'Customers can review service information before booking with a laundry partner.',
  },
  {
    icon: Clock,
    title: 'Operational Visibility',
    description: 'Order status, pricing, hours, and staff tools help laundry teams manage work.',
  },
  {
    icon: Heart,
    title: 'Support Access',
    description: 'Customers and partners can reach official Simame support channels when needed.',
  },
  {
    icon: CheckCircle2,
    title: 'Structured Pricing',
    description: 'Partner-managed pricing tools support clearer item, weight, and delivery-zone workflows.',
  },
]