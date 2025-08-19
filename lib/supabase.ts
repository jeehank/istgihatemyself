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
    }
  }
}
