'use client'

export interface AuthData {
  clubName: string
  isAuthenticated: boolean
  loginTime: number
}

export function getAuthData(): AuthData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const authString = localStorage.getItem('xclubs_admin_auth')
    if (!authString) return null

    const authData: AuthData = JSON.parse(authString)
    
    // Check if login is still valid (24 hours)
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
    const isExpired = Date.now() - authData.loginTime > TWENTY_FOUR_HOURS
    
    if (isExpired) {
      localStorage.removeItem('xclubs_admin_auth')
      return null
    }

    return authData
  } catch (error) {
    console.error('Error parsing auth data:', error)
    localStorage.removeItem('xclubs_admin_auth')
    return null
  }
}

export function isAuthenticated(): boolean {
  const authData = getAuthData()
  return authData?.isAuthenticated === true
}

export function logout(): void {
  localStorage.removeItem('xclubs_admin_auth')
}

export function getClubName(): string | null {
  const authData = getAuthData()
  return authData?.clubName || null
}
