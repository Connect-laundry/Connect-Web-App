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
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
]

export const services = [
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

export const processSteps = [
  {
    step: '01',
    title: 'Schedule a Pickup',
    description: "Book a pickup online or call us. Choose a time that works for you and we'll be there.",
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

export const reasons = [
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
    description: "No hidden fees. Know exactly what you'll pay before you book. Simple, honest pricing.",
  },
]
