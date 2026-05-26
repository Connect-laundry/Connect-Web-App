import { CheckCircle2, Shield, Truck } from 'lucide-react'

const items = [
  { icon: Truck, label: 'Free pickup & delivery' },
  { icon: Shield, label: 'Verified local partners' },
  { icon: CheckCircle2, label: 'Owner dashboard included' },
]

export function TrustPills() {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm"
        >
          <item.icon className="h-4 w-4 text-primary shrink-0" />
          {item.label}
        </div>
      ))}
    </div>
  )
}
