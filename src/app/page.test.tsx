import { render, screen } from '@testing-library/react'
import HomePage from './page'
import { vi, describe, it, expect } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

// Mock next/image — omit Next.js-only props that are invalid on <img>
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority: _priority,
    unoptimized: _unoptimized,
    fill: _fill,
    ...props
  }: {
    src: string
    alt: string
    priority?: boolean
    unoptimized?: boolean
    fill?: boolean
  }) => <img src={src} alt={alt} {...props} />,
}))

// Mock Auth Context
vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
  }),
}))

describe('HomePage', () => {
  it('renders the hero section', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Fresh, Clean & Delivered to Your Door/i,
    )
    expect(
      screen.getByText(/Connect Laundry offers premium laundry and dry cleaning services/i),
    ).toBeInTheDocument()
  })

  it('renders the Get Started button', () => {
    render(<HomePage />)
    const getStartedButtons = screen.getAllByText(/Get Started/i)
    expect(getStartedButtons.length).toBeGreaterThan(0)
  })
})