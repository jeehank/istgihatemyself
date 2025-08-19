'use client'

import { useSecretAccess } from '@/hooks/useSecretAccess'

interface SecretAccessProviderProps {
  children: React.ReactNode
}

export default function SecretAccessProvider({ children }: SecretAccessProviderProps) {
  useSecretAccess()
  
  return <>{children}</>
}
