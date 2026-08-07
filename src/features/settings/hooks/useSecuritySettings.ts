import { useState } from 'react'
import { requestPasswordReset, revokeAllSessions } from '@/features/account/api'
import { useAuth } from '@/features/auth/context/AuthContext'

export function useSecuritySettings() {
  const { user } = useAuth()
  const [resetEmail, setResetEmail] = useState(user?.email ?? '')
  const [resetSent, setResetSent] = useState(false)
  const sendReset = async () => { await requestPasswordReset(resetEmail); setResetSent(true) }
  return { resetEmail, setResetEmail, resetSent, sendReset, revokeSessions: revokeAllSessions }
}
