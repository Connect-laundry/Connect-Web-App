export function getDashboardGreeting(firstName?: string | null): string {
  return firstName ? `Welcome back, ${firstName}` : 'Welcome back'
}
