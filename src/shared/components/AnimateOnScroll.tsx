'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export type AnimationVariant =
  | 'fade-in'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'fade'

interface AnimateOnScrollProps {
  children: ReactNode
  animation?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  threshold?: number
}

export const AnimateOnScroll = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.1,
}: AnimateOnScrollProps) => {
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
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  const transforms: Record<AnimationVariant, string> = {
    'fade-up': 'translateY(40px)',
    'fade-down': 'translateY(-40px)',
    'fade-left': 'translateX(40px)',
    'fade-right': 'translateX(-40px)',
    'slide-up': 'translateY(32px)',
    'slide-down': 'translateY(-32px)',
    'slide-left': 'translateX(32px)',
    'slide-right': 'translateX(-32px)',
    'zoom-in': 'scale(0.9)',
    'fade-in': 'none',
    'fade': 'none',
  }

  return (
    <div
      ref={ref}
      className={cn('transition-all ease-out', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : transforms[animation] || 'none',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
