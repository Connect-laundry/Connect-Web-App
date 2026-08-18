'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { AnimateOnScroll } from '@/shared/components/AnimateOnScroll'
import { Users, Settings, Store } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export const QuickActionsCard = () => {
  const actions = [
    { label: 'Register & Assign Staff', icon: Users, color: 'blue', href: '/staff' },
    { label: 'Update Service Fees', icon: Settings, color: 'gray', href: '/business' },
    { label: 'Review Business Info', icon: Store, color: 'indigo', href: '/business' },
  ]

  return (
    <AnimateOnScroll animation="slide-up" delay={500}>
      <Card className="h-full border-border/50 shadow-sm flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {actions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              asChild
              className="w-full h-12 justify-start gap-4 border-border/50 hover:bg-primary/5 hover:text-primary text-foreground group transition-all font-bold"
            >
              <Link href={action.href}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0',
                    action.color === 'blue'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : action.color === 'indigo'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
