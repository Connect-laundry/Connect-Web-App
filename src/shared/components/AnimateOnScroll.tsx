'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface AnimateOnScrollProps {
  children: ReactNode
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  delay?: number
  className?: string
  threshold?: number
}

export function AnimateOnScroll({
  children,
  animation = 'fade-in',
  delay = 0,
  className,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  const animationStyles: Record<string, string> = {
    'fade-in': 'translate-y-0 opacity-100',
    'slide-up': 'translate-y-0 opacity-100',
    'slide-down': 'translate-y-0 opacity-100',
    'slide-left': 'translate-x-0 opacity-100',
    'slide-right': 'translate-x-0 opacity-100',
  }

  const initialStyles: Record<string, string> = {
    'fade-in': 'translate-y-2 opacity-0',
    'slide-up': 'translate-y-8 opacity-0',
    'slide-down': '-translate-y-8 opacity-0',
    'slide-left': 'translate-x-8 opacity-0',
    'slide-right': '-translate-x-8 opacity-0',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? animationStyles[animation] : initialStyles[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
