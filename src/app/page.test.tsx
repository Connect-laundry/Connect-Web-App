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

// Mock next/image to avoid issues in tests
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
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
    // Check for the hero text
    expect(screen.getByText(/Fresh, Clean &/i)).toBeInTheDocument()
    expect(screen.getByText(/Professional Laundry Services/i)).toBeInTheDocument()
  })

  it('renders the Get Started button', () => {
    render(<HomePage />)
    const getStartedButtons = screen.getAllByText(/Get Started/i)
    expect(getStartedButtons.length).toBeGreaterThan(0)
  })
})
