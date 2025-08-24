import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clubs: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          activities: string[]
          entry_fee: number
          about: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          activities: string[]
          entry_fee: number
          about: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          activities?: string[]
          entry_fee?: number
          about?: string
          created_at?: string
        }
      }
      news: {
        Row: {
          id: string
          club_id: string
          title: string
          content: string
          author: string
          likes: number
          type: 'featured' | 'regular' | 'announcement'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          title: string
          content: string
          author: string
          likes?: number
          type?: 'featured' | 'regular' | 'announcement'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          title?: string
          content?: string
          author?: string
          likes?: number
          type?: 'featured' | 'regular' | 'announcement'
          created_at?: string
          updated_at?: string
        }
      }
      club_admins: {
        Row: {
          id: string
          club_name: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          club_name: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          club_name?: string
          password_hash?: string
          created_at?: string
        }
      }
      club_registrations: {
        Row: {
          id: string
          name: string
          email: string
          class: string
          section: string
          roll_no: string
          phone: string | null
          club_id: string
          club_name: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          class: string
          section: string
          roll_no: string
          phone?: string | null
          club_id: string
          club_name: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          class?: string
          section?: string
          roll_no?: string
          phone?: string | null
          club_id?: string
          club_name?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          name: string
          class: string
          section: string
          roll_no: string
          password_hash: string
          email: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          class: string
          section: string
          roll_no: string
          password_hash: string
          email?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          class?: string
          section?: string
          roll_no?: string
          password_hash?: string
          email?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      club_memberships: {
        Row: {
          id: string
          member_id: string
          club_id: string
          club_name: string
          status: 'active' | 'inactive' | 'banned'
          joined_at: string
        }
        Insert: {
          id?: string
          member_id: string
          club_id: string
          club_name: string
          status?: 'active' | 'inactive' | 'banned'
          joined_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          club_id?: string
          club_name?: string
          status?: 'active' | 'inactive' | 'banned'
          joined_at?: string
        }
      }
      club_groups: {
        Row: {
          id: string
          club_id: string
          club_name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          club_name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          club_name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      group_messages: {
        Row: {
          id: string
          group_id: string
          sender_id: string | null
          sender_name: string
          sender_type: 'member' | 'admin' | 'system'
          message_text: string
          message_type: 'text' | 'news_update' | 'announcement' | 'system'
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          sender_id?: string | null
          sender_name: string
          sender_type?: 'member' | 'admin' | 'system'
          message_text: string
          message_type?: 'text' | 'news_update' | 'announcement' | 'system'
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          sender_id?: string | null
          sender_name?: string
          sender_type?: 'member' | 'admin' | 'system'
          message_text?: string
          message_type?: 'text' | 'news_update' | 'announcement' | 'system'
          metadata?: any
          created_at?: string
        }
      }
    }
  }
}
