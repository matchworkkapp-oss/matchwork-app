export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'candidate' | 'recruiter'
export type SearchStatus = 'active' | 'open' | 'passive'
export type SwipeDirection = 'like' | 'pass'
export type SkillLevel = 'basic' | 'intermediate' | 'advanced' | 'expert'
export type WorkMode = 'remote' | 'hybrid' | 'onsite'
export type CompanySize = 'startup' | 'small' | 'medium' | 'large'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      candidate_profiles: {
        Row: {
          id: string
          user_id: string
          headline: string | null
          bio: string | null
          location: string | null
          availability: string | null
          work_mode: WorkMode | null
          salary_min: number | null
          salary_max: number | null
          salary_currency: string
          search_status: SearchStatus
          video_url: string | null
          super_matches_remaining: number
          profile_completion: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['candidate_profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['candidate_profiles']['Insert']>
      }
      company_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          about: string | null
          industry: string | null
          size: CompanySize | null
          location: string | null
          website: string | null
          logo_url: string | null
          verified: boolean
          super_matches_remaining: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['company_profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['company_profiles']['Insert']>
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['skills']['Insert']>
      }
      candidate_skills: {
        Row: {
          id: string
          candidate_id: string
          skill_id: string
          level: SkillLevel
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['candidate_skills']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['candidate_skills']['Insert']>
      }
      job_posts: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string | null
          requirements: string[]
          work_mode: WorkMode
          location: string | null
          salary_min: number | null
          salary_max: number | null
          salary_currency: string
          contract_type: string | null
          industry: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['job_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['job_posts']['Insert']>
      }
      job_skills: {
        Row: {
          id: string
          job_id: string
          skill_id: string
          weight: number
          required: boolean
        }
        Insert: Omit<Database['public']['Tables']['job_skills']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['job_skills']['Insert']>
      }
      swipes: {
        Row: {
          id: string
          swiper_id: string
          target_id: string
          direction: SwipeDirection
          is_super: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['swipes']['Row'], 'id' | 'created_at'>
        Update: never
      }
      matches: {
        Row: {
          id: string
          candidate_id: string
          job_id: string
          company_id: string
          match_score: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'id' | 'created_at'>
        Update: never
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Pick<Database['public']['Tables']['messages']['Row'], 'read'>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
