import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string(),
    first_name: z.string().min(2, 'First name is required'),
    last_name: z.string().min(2, 'Last name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    role: z.enum(['OWNER', 'CUSTOMER']).default('OWNER'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ['password_confirm'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const registerFormDefaults: RegisterFormValues = {
  email: '',
  password: '',
  password_confirm: '',
  first_name: '',
  last_name: '',
  phone: '',
  role: 'OWNER',
}

interface ApiErrorLike {
  message?: string
  data?: { data?: Record<string, unknown> } | Record<string, unknown>
}

export function getRegistrationError(error: ApiErrorLike): string {
  const outer = error.data ?? {}
  const fields = ('data' in outer && outer.data ? outer.data : outer) as Record<string, unknown>
  const email = fields.email
  const phone = fields.phone
  const emailTaken = Array.isArray(email) && /unique/i.test(String(email[0] ?? ''))
  const phoneTaken = Array.isArray(phone) && /unique/i.test(String(phone[0] ?? ''))

  if (emailTaken && phoneTaken) return 'An account with this email and phone number already exists. Try logging in instead.'
  if (emailTaken) return 'An account with this email already exists. Try logging in instead.'
  if (phoneTaken) return 'An account with this phone number already exists. Try logging in instead.'
  return error.message || 'Failed to register. Please try again.'
}
