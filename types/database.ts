// Supabase 데이터베이스 타입 정의

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          ingredients: string
          instructions: string
          cooking_time: number | null
          difficulty: '쉬움' | '보통' | '어려움' | null
          category: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          ingredients: string
          instructions: string
          cooking_time?: number | null
          difficulty?: '쉬움' | '보통' | '어려움' | null
          category?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          ingredients?: string
          instructions?: string
          cooking_time?: number | null
          difficulty?: '쉬움' | '보통' | '어려움' | null
          category?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 편의를 위한 타입 별칭
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Recipe = Database['public']['Tables']['recipes']['Row']

// 레시피와 작성자 프로필을 함께 가져올 때 사용할 타입
export type RecipeWithProfile = Recipe & {
  profile: Profile
}
