import Link from 'next/link'
import { DASHBOARD_SHORTCUTS } from '@/features/dashboard/constants/shortcuts'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { ArrowUpRight, Package, Settings, Store, type LucideIcon } from 'lucide-react'

const SHORTCUT_ICONS: Record<string, LucideIcon> = {
  package: Package,
  store: Store,
  settings: Settings,
}

export const DashboardShortcutsCard = () => {
  return (
    <AnimateOnScroll animation="slide-up" delay={280}>
      <Card className="surface-card border-0 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-black">Shortcuts</CardTitle>
          <CardDescription>Jump to common tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {DASHBOARD_SHORTCUTS.map((item) => {
            const Icon = SHORTCUT_ICONS[item.iconName]
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-between rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 group"
                >
                  <span className="flex items-center gap-3 font-semibold text-sm">
                    <Icon className="w-4 h-4 text-primary" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              </Link>
            )
          })}
          <Link href="/earnings" className="block pt-2">
            <div className="rounded-2xl p-4 bg-linear-to-br from-accent/20 to-primary/10 border border-accent/20">
              <p className="text-xs font-bold text-accent-foreground/80 uppercase tracking-wider">Earnings</p>
              <p className="text-sm font-semibold mt-1 text-foreground">View full revenue breakdown</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
