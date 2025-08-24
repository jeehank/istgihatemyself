import { supabase } from './supabase'

export interface MemberAuthData {
  id: string
  name: string
  class: string
  section: string
  rollNo: string
  isAuthenticated: boolean
  loginTime: number
}

export interface MemberLoginCredentials {
  name: string
  class: string
  section: string
  rollNo: string
  password: string
}

export interface MemberRegistrationData {
  name: string
  class: string
  section: string
  rollNo: string
  password: string
  email?: string
  phone?: string
  clubId: string
}

// Simple hash function for demo purposes (in production, use bcrypt or similar)
export function hashPassword(password: string): string {
  // Simple hash for demo - in production use proper bcrypt
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export function verifyMemberPassword(inputPassword: string, storedHash: string): boolean {
  return hashPassword(inputPassword) === storedHash
}

export async function authenticateMember(credentials: MemberLoginCredentials): Promise<MemberAuthData | null> {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('name', credentials.name)
      .eq('class', credentials.class)
      .eq('section', credentials.section.toUpperCase())
      .eq('roll_no', credentials.rollNo)
      .eq('is_active', true)
      .single()

    if (error || !member) {
      return null
    }

    const isValidPassword = verifyMemberPassword(credentials.password, member.password_hash)
    
    if (!isValidPassword) {
      return null
    }

    return {
      id: member.id,
      name: member.name,
      class: member.class,
      section: member.section,
      rollNo: member.roll_no,
      isAuthenticated: true,
      loginTime: Date.now()
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function registerMember(data: MemberRegistrationData): Promise<boolean> {
  try {
    const passwordHash = hashPassword(data.password)
    
    const { error } = await supabase
      .from('members')
      .insert([{
        name: data.name,
        class: data.class,
        section: data.section.toUpperCase(),
        roll_no: data.rollNo,
        password_hash: passwordHash,
        email: data.email,
        phone: data.phone
      }])

    if (error) {
      console.error('Registration error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Registration error:', error)
    return false
  }
}

export async function checkMemberExists(name: string, class_: string, section: string, rollNo: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('id')
      .eq('name', name)
      .eq('class', class_)
      .eq('section', section.toUpperCase())
      .eq('roll_no', rollNo)
      .single()

    return !error && !!data
  } catch (error) {
    return false
  }
}

export function storeMemberAuth(authData: MemberAuthData): void {
  localStorage.setItem('xclubs_member_auth', JSON.stringify(authData))
}

export function getMemberAuthData(): MemberAuthData | null {
  try {
    const stored = localStorage.getItem('xclubs_member_auth')
    if (!stored) return null

    const authData = JSON.parse(stored) as MemberAuthData
    
    // Check if login is still valid (24 hours)
    const now = Date.now()
    const loginAge = now - authData.loginTime
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    if (loginAge > maxAge) {
      memberLogout()
      return null
    }

    return authData
  } catch (error) {
    console.error('Error getting member auth data:', error)
    return null
  }
}

export function memberLogout(): void {
  localStorage.removeItem('xclubs_member_auth')
}

export async function addMemberToClub(memberId: string, clubId: string, clubName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('club_memberships')
      .insert([{
        member_id: memberId,
        club_id: clubId,
        club_name: clubName,
        status: 'active'
      }])

    if (error) {
      console.error('Error adding member to club:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error adding member to club:', error)
    return false
  }
}

export async function getMemberClubs(memberId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('club_memberships')
      .select('*')
      .eq('member_id', memberId)
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching member clubs:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching member clubs:', error)
    return []
  }
}
